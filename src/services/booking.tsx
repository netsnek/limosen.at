// src/services/booking.tsx
import React, {useMemo} from 'react'
import {sendTemplateMail} from 'gatsby-jaen-emailwerk'
import {BOOKING_TEMPLATE_ID} from './mail-templates'
import {useLocation} from '@reach/router'
import {
  BookingFormValues,
  BookingModal
} from '../components/BookingModal/BookingModal'
import {useAuth, useNotificationsContext} from 'jaen'
import {useQueryRouter} from '../hooks/use-query-router'
import {useT} from '../contexts/language'
import {useIntl} from 'react-intl'

import {bookTransfer} from './book-transfer'

/**
 * What a caller may put into the form before the visitor sees it.
 *
 * `carClass` is the translated class label the form's class dropdown lists
 * ('First Class', 'الدرجة الأولى'), not the database value, and `carTitle` is
 * one of the model names the vehicle dropdown offers for that class. The fleet
 * cards on the home page pass exactly the pair they show, so a click on a card
 * lands in a form that already names the car.
 */
export interface BookingDefaults {
  carClass?: string
  carTitle?: string
}

export interface BookingModalContextProps {
  onOpen: (args?: {meta?: Record<string, any>; defaults?: BookingDefaults}) => void
  onClose: () => void
}

export const BookingModalContext =
  React.createContext<BookingModalContextProps>({
    onOpen: () => {},
    onClose: () => {}
  })

export const useBookingModal = () => {
  const context = React.useContext(BookingModalContext)
  if (!context) {
    throw new Error('useBookingModal must be used within a BookingModalProvider')
  }
  return context
}

export interface BookingModalDrawerProps {
  children: React.ReactNode
}

// Minimal shape we need for the IAM mutation (keeps this file decoupled)
type ApiTransferCreateInput = {
  rideDateISO: string
  rideTime: string
  pickup: string
  dropoff: string
  roomOrName: string
  vehicle?: string
  payment?: string
  amountEUR?: number
}

type ApiTransferBookingDetails = {
  // Passenger (ride person)
  passengerFirstName?: string
  passengerLastName?: string
  passengerEmail?: string
  passengerPhone?: string

  // Customer (booker/payer)
  customerFirstName?: string
  customerLastName?: string
  customerEmail?: string
  customerPhone?: string

  // Other fields (same as email template)
  flightNumber?: string
  message?: string

  rideCategory?: string
  rideType?: string
  passengers?: string | number
  luggage?: string | number
  childSeats?: string | number
  extraTime?: string | number

  carClass?: string
  carTitle?: string

  paymentOption?: string

  locale?: string
  invokedOnUrl?: string
}

const emptyToUndef = (v?: string | null) => {
  if (typeof v !== 'string') return undefined
  const t = v.trim()
  return t.length ? t : undefined
}

export const BookingModalProvider: React.FC<BookingModalDrawerProps> = ({
  children
}) => {
  const t = useT()
  const {locale} = useIntl()
  const location = useLocation()
  const {isCalled, paramValue} = useQueryRouter(location, 'booking')

  const [meta, setMeta] = React.useState<Record<string, any> | null>(null)
  const [defaults, setDefaults] = React.useState<BookingDefaults | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  // v3 dropped useToast for a store whose create() reads `type`, not `status`.
  // jaen's notifications context wraps that store back up in v2's option shape
  // and is already mounted above every page, so the calls below keep the
  // placement, timing and close button they had.
  const {toast} = useNotificationsContext()
  const authentication = useAuth()

  const getCurrentUrl = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.location) {
      return window.location.href
    }
    const pathname = location?.pathname ?? '/'
    const search = location?.search ?? ''
    const hash = location?.hash ?? ''
    return `${pathname}${search}${hash}`
  }, [location])

  React.useEffect(() => {
    if (isCalled) {
      setMeta(prev => ({...prev, url: getCurrentUrl()}))
      setIsOpen(true)
    }
  }, [isCalled, getCurrentUrl])

  const onOpen: BookingModalContextProps['onOpen'] = args => {
    const updatedMeta = {
      ...meta,
      url: getCurrentUrl(),
      ...args?.meta
    }
    setMeta(updatedMeta)
    // A caller that names no car clears the last one: the nav's "book online"
    // after a card click must not still carry that card's class.
    setDefaults(args?.defaults ?? null)
    setIsOpen(true)
  }

  const onClose = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('booking')
      window.history.replaceState({}, '', url.toString())
    }
    setIsOpen(false)
  }

  const fixedValues = useMemo(() => {
    if (!authentication.user) {
      return undefined
    }
    return {
      firstName: authentication.user.profile?.given_name,
      lastName: authentication.user.profile?.family_name,
      email: authentication.user.profile?.email,
      phone: authentication.user.profile?.phone_number
    }
  }, [authentication.user])

  const defaultValues = useMemo(() => {
    if (!isCalled && !defaults) {
      return undefined
    }
    return {
      message: isCalled ? paramValue : undefined,
      carClass: defaults?.carClass,
      carTitle: defaults?.carTitle
    }
  }, [isCalled, paramValue, defaults])

  const mergeFixedIntoSubmit = React.useCallback(
    (data: BookingFormValues): BookingFormValues => {
      // BookingModal might not always include disabled "fixed" fields in submit,
      // so we always backfill from fixedValues (and let explicit user input win).
      return {
        ...data,
        firstName: data.firstName || fixedValues?.firstName || '',
        lastName: data.lastName || fixedValues?.lastName || '',
        email: data.email || fixedValues?.email || '',
        phone: data.phone || fixedValues?.phone || ''
      }
    },
    [fixedValues]
  )

  const createBookingInApi = async (
    data: BookingFormValues,
    invokedOnUrl: string
  ): Promise<string | null> => {
    // Map modal values -> IAM booking mutation input
    // NOTE: booking should work even when NOT authenticated.
    const input: ApiTransferCreateInput = {
      rideDateISO: data.date || '',
      rideTime: data.time || '',
      pickup: data.pickupAddress || '',
      dropoff: data.destinationAddress || '',
      roomOrName: 'website', // ✅ your requirement
      vehicle: data.carTitle || data.carClass || undefined,
      payment: data.paymentOption || undefined
      // amountEUR: undefined (not available in this form)
    }

    // Optional details payload: for self-booking, passenger == customer
    const details: ApiTransferBookingDetails = {
      // passenger
      passengerFirstName: emptyToUndef(data.firstName),
      passengerLastName: emptyToUndef(data.lastName),
      passengerEmail: emptyToUndef(data.email),
      passengerPhone: emptyToUndef(data.phone || ''),

      // customer (same as passenger for self-booking)
      customerFirstName: emptyToUndef(data.firstName),
      customerLastName: emptyToUndef(data.lastName),
      customerEmail: emptyToUndef(data.email),
      customerPhone: emptyToUndef(data.phone || ''),

      // rest
      flightNumber: emptyToUndef(data.flightNumber || ''),
      message: emptyToUndef(data.message),

      rideCategory: emptyToUndef(data.rideCategory || ''),
      rideType: emptyToUndef(data.rideType || ''),
      passengers: data.passengers ?? undefined,
      luggage: data.luggage ?? undefined,
      childSeats: data.childSeats ?? undefined,
      extraTime: data.extraTime ?? undefined,

      carClass: emptyToUndef(data.carClass || ''),
      carTitle: emptyToUndef(data.carTitle || ''),

      paymentOption: emptyToUndef(data.paymentOption || ''),

      locale,
      invokedOnUrl
    }

    // If the form doesn't have enough to create a booking, skip API call.
    // (Email will still be sent.)
    if (!input.rideDateISO || !input.rideTime || !input.pickup || !input.dropoff) {
      return null
    }

    try {
      const transferId = await bookTransfer({
        // The form collects a date and a time; the backend takes one instant.
        pickupDateTime: `${input.rideDateISO}T${input.rideTime}:00`,
        pickupLocation: input.pickup,
        dropoffLocation: input.dropoff,
        subject: input.roomOrName,
        paymentMethode: input.payment,
        passengers: {
          firstName: details.passengerFirstName,
          lastName: details.passengerLastName,
          email: details.passengerEmail,
          phone: details.passengerPhone,
          language: locale
        },
        details: {
          flightNumber: details.flightNumber,
          message: details.message,
          transferCategory: details.rideCategory,
          transferType: details.rideType,
          luggage: details.luggage,
          childSeats: details.childSeats,
          extraTime: details.extraTime,
          preferredCarClass: details.carClass,
          preferredCarName: details.carTitle
        }
      })

      setMeta(prev => ({...(prev ?? {}), transferId}))
      return typeof transferId === 'string' ? transferId : null
    } catch (err) {
      // The visitor gets a calm sentence, but somebody debugging this needs the
      // actual reason. Swallowing it whole is how a schema mismatch stayed
      // invisible: every refused booking looked the same from the outside.
      console.error('bookTransfer failed:', err)

      // If the API rejects (e.g. misconfig / temporary issue), still proceed with email.
      toast({
        title: t('ToastApiBookingErrorTitle', 'Booking not created'),
        description: t(
          'ToastApiBookingErrorDesc',
          'We could not create the booking in our system. Your request will still be sent by email.'
        ),
        status: 'warning',
        duration: 7000,
        isClosable: true
      })
      return null
    }
  }

  const onSubmit = async (rawData: BookingFormValues): Promise<void> => {
    const data = mergeFixedIntoSubmit(rawData)
    const invokedOnUrl = meta?.url ?? getCurrentUrl() ?? 'unknown'

    // 1) Create booking in API (no auth requirement assumed)
    const transferId = await createBookingInApi(data, invokedOnUrl)

    // 2) Send email
    // `ok` rather than `errors`, for the reason spelled out in contact.tsx: a
    // failure that is not a GraphQL error left `errors` undefined and the visitor
    // saw the success toast.
    const {ok} = await sendTemplateMail(
      BOOKING_TEMPLATE_ID,
      {
        envelope: {
          replyTo: data.email
        },
        values: {
          // Contact
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          flightNumber: data.flightNumber || '',
          message: data.message,

          // Ride details
          rideCategory: data.rideCategory || '',
          rideType: data.rideType || '',
          date: data.date || '',
          time: data.time || '',
          pickupAddress: data.pickupAddress || '',
          destinationAddress: data.destinationAddress || '',
          passengers: data.passengers ?? '',
          luggage: data.luggage ?? '',
          childSeats: data.childSeats ?? '',
          extraTime: data.extraTime ?? '',

          // Vehicle & Payment
          carClass: data.carClass || '',
          carTitle: data.carTitle || '',
          paymentOption: data.paymentOption || '',

          // Meta
          locale,
          invokedOnUrl,
          transferId: transferId || ''
        }
      }
    )

    if (!ok) {
      toast({
        title: t('ToastErrorTitle', 'Error'),
        description: t('ToastErrorDesc', 'Something went wrong.'),
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } else {
      toast({
        title: t('ToastSuccessTitle', 'Success'),
        description: transferId
          ? t(
              'ToastSuccessDescWithId',
              'Your reservation request has been sent successfully.'
            ) + ` (ID: ${transferId})`
          : t(
              'ToastSuccessDesc',
              'Your reservation request has been sent successfully.'
            ),
        status: 'success',
        duration: 5000,
        isClosable: true
      })
      onClose()
    }
  }

  return (
    <BookingModalContext.Provider value={{onOpen, onClose}}>
      {children}
      <BookingModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        fixedValues={fixedValues}
        defaultValues={defaultValues}
      />
    </BookingModalContext.Provider>
  )
}
