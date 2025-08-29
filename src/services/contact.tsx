import {useToast} from '@chakra-ui/react'
import {sendTemplateMail} from 'gatsby-jaen-mailpress'
import React, {useMemo} from 'react'

import {useAuth} from 'jaen'
import {navigate} from 'gatsby'
import { useQueryRouter } from "../hooks/use-query-router"
import { ContactFormValues, ContactModal } from "../components/ContactModal/ContactModal"

export interface ContactModalContextProps {
  onOpen: (args?: {meta?: Record<string, any>}) => void
  onClose: () => void
}

export const ContactModalContext =
  React.createContext<ContactModalContextProps>({
    onOpen: () => {},
    onClose: () => {}
  })

export const useContactModal = () => {
  if (!ContactModalContext) {
    throw new Error(
      'useContactModal must be used within a ContactModalProvider'
    )
  }

  return React.useContext(ContactModalContext)
}

export interface ContactModalDrawerProps {
  children: React.ReactNode
  location: {
    pathname: string
    search: string
  }
}

export const ContactModalProvider: React.FC<ContactModalDrawerProps> = ({
  location,
  children
}) => {
  const {isCalled, paramValue} = useQueryRouter(location, 'contact')

  const [meta, setMeta] = React.useState<Record<string, any> | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    if (isCalled) {
      setIsOpen(true)
      //alert(paramValue)
    }
  }, [isCalled])

  const toast = useToast()

  const authentication = useAuth()

  const onOpen: ContactModalContextProps['onOpen'] = args => {
    const updatedMeta = {
      ...meta,
      url: window.location.href
    }

    setMeta(updatedMeta)
    setIsOpen(true)
  }
  const onClose = () => {
    // Remove the "contact" query parameter from the URL without reloading the page.
    const url = new URL(window.location.href)
    url.searchParams.delete("contact")
    window.history.replaceState({}, '', url.toString())

    setIsOpen(false)
  }

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    // sleep 3 seconds to simulate a network request

    console.log(data, meta)

    const res = await sendTemplateMail(
      '9c919b15-02f9-46ef-8fe8-db0b04abfc40', // replace with your actual template ID
    {
     envelope: {
        replyTo: data.email
     },
      values: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        invokedOnUrl: meta?.url
      }
    

    })
  

    if (!res.ok) {
      // Deutsch
      toast({
        title: 'Fehler',
        description: 'Es ist ein Fehler aufgetreten.',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } else {
      toast({
        title: 'Erfolg',
        description: 'Ihre Nachricht wurde erfolgreich versendet.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })

      onClose()
    }
  }

  const fixedValues = useMemo(() => {
    if (!authentication.user) {
      return undefined
    }

    return {
      firstName: authentication?.user?.profile?.given_name,
      lastName: authentication?.user?.profile?.family_name,
      email: authentication?.user?.profile?.email
    }
  }, [authentication.user])

  const defaultValues = useMemo(() => {
    if (!isCalled) {
      return undefined
    }

    return {
      message: paramValue
    }
  }, [isCalled, paramValue])

  return (
    <ContactModalContext.Provider value={{onOpen, onClose}}>
      {children}
      <ContactModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
        fixedValues={fixedValues}
        defaultValues={defaultValues}
      />
    </ContactModalContext.Provider>
  )
}
