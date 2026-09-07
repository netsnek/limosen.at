import React from 'react'
import type {PageProps} from 'gatsby'
import {
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  Stack,
  Text
} from '@chakra-ui/react'
import {PageConfig, useAuth} from 'jaen'

import {Logo} from '../../gatsby-plugin-jaen/components/Logo'
import {SITE} from '../../vars/site-variants'
import {
  rideByToken,
  NETWORK,
  RideError,
  type CustomerStatus,
  type RideLanguage,
  type RideSummary,
  type TransferState
} from '../../services/ride'

/**
 * The customer's ride, behind one public link.
 *
 * Section 7 of taxi-app's okf/architecture/customer-experience.md: the owner
 * asked for "a link for the customer to open the details of his transfer and
 * where he can also look at the images of the car that is gonna pick him up".
 * Every message to the customer carries `/fahrt/<token>` as "Ihre Fahrt
 * öffnen", and this is the page it opens. It needs no account: the token is
 * the offer token's sibling and the only credential the page holds.
 *
 * It shows what the customer already got by mail. The code, the status in
 * their own words, the pickup, the route, how many ride, the price where one
 * is set, the return leg where there is one, the offer and the invoice behind
 * the pylon's signed links, and once the driver said yes the card "Ihr
 * Fahrzeug" with the picture, the name, the colour dot and the plate plus the
 * driver's first name. Before that yes the card reads "Fahrer wird zugeteilt",
 * because until then the car on the ride is the dispatcher's intention. It
 * never shows the driver's phone, the other passengers or the live position:
 * those stay in the app for account holders, section 2.
 *
 * The letterhead is the offer page's, deliberately: the two pages are the
 * same letter to the same person, so they share the paper, the logo, the
 * sender line and the grey footer. Every word is in the booking's language,
 * which the summary carries, so a Turkish booking gets a Turkish page whatever
 * the visitor's browser says. Until the summary is there, and on a link the
 * pylon refuses, the browser's language decides, reduced to the four the sites
 * speak, German otherwise. Arabic is right to left.
 *
 * The skeleton comes first and never a blank, and a refresh button reloads the
 * summary the way every view of the app has one: a ride's driver, state and
 * documents change while the page is open.
 *
 * A signed-in customer sees a second link, "In der App öffnen", to
 * `/app/booking/<code>/`, which is the same ride with the map, the driver's
 * colour and the cancel button on it.
 *
 * The page has no colour mode, like `/angebot/`: it sits outside the routes
 * that carry one, so it is forced light and the colours below are the
 * letterhead's own rather than the site's tokens.
 */

/** The letterhead's colours, the same values letter.typ and /angebot/ use. */
const PAPER = {
  bg: '#ffffff',
  ink: '#1a1a1a',
  muted: '#4d4d4d',
  rowgray: '#ededed',
  footer: '#666666',
  rule: '#d9d9d9',
  gold: '#d4af37',
  goldHover: '#b8932f',
  goldActive: '#9a7b26',
  red: '#b03a2e'
}

type StatusWords = Record<CustomerStatus, string>
type StateWords = Record<TransferState, string>

interface Words {
  title: string
  code: string
  status: string
  refresh: string
  loading: string
  sectionRide: string
  date: string
  route: string
  passengers: string
  passengersCount: string
  total: string
  vat: string
  priceOpen: string
  returnHeading: string
  returnOpen: string
  vehicle: string
  driverPending: string
  driverPendingHint: string
  driver: string
  documents: string
  docOFFER: string
  docINVOICE: string
  openPdf: string
  openInApp: string
  linkInvalid: string
  network: string
  retry: string
  contact: string
  contactHeading: string
  /** The customer's own words for the status, as the booking list has them. */
  customer: StatusWords
  /** The ride state, the twelve of i18nStates. */
  state: StateWords
}

/** German first, like every product string. */
const WORDS: Record<RideLanguage, Words> = {
  de: {
    title: 'Ihre Fahrt',
    code: 'Buchungscode',
    status: 'Status',
    refresh: 'Aktualisieren',
    loading: 'Fahrt wird geladen',
    sectionRide: 'Fahrt',
    date: 'Abholung',
    route: 'Strecke',
    passengers: 'Personen',
    passengersCount: '{count} Personen',
    total: 'Gesamtbetrag brutto',
    vat: 'inkl. 20 % USt.',
    priceOpen: 'Wird festgelegt',
    returnHeading: 'Rückfahrt',
    returnOpen: 'Rückfahrt öffnen',
    vehicle: 'Ihr Fahrzeug',
    driverPending: 'Fahrer wird zugeteilt',
    driverPendingHint:
      'Sobald ein Fahrer die Fahrt übernommen hat, sehen Sie hier das Fahrzeug.',
    driver: 'Fahrer',
    documents: 'Dokumente',
    docOFFER: 'Angebot',
    docINVOICE: 'Rechnung',
    openPdf: 'PDF öffnen',
    openInApp: 'In der App öffnen',
    linkInvalid:
      'Dieser Link ist ungültig. Bitte öffnen Sie den Link aus Ihrer E-Mail.',
    network:
      'Die Verbindung ist fehlgeschlagen. Bitte versuchen Sie es noch einmal.',
    retry: 'Erneut versuchen',
    contact: 'Bei Fragen erreichen Sie uns unter {phone} oder {email}.',
    contactHeading: 'Kontakt',
    customer: {
      NEW: 'Anfrage eingegangen',
      OFFERED: 'Angebot erhalten',
      CONFIRMED: 'Bestätigt',
      INVOICED: 'Rechnung erhalten',
      PAID: 'Bezahlt',
      DECLINED: 'Abgelehnt'
    },
    state: {
      PENDING: 'Offen',
      ASSIGNED: 'Zugewiesen',
      REJECTED: 'Abgelehnt',
      ABORTED: 'Abgebrochen',
      ON_THE_WAY: 'Unterwegs',
      AT_PICKUP: 'Am Abholort',
      NO_SHOW: 'Nicht erschienen',
      FAILED: 'Fehlgeschlagen',
      CANCELED: 'Storniert',
      TERMINATED: 'Beendet',
      ONGOING: 'Fahrt läuft',
      COMPLETED: 'Erledigt'
    }
  },
  en: {
    title: 'Your ride',
    code: 'Booking code',
    status: 'Status',
    refresh: 'Refresh',
    loading: 'Loading your ride',
    sectionRide: 'Ride',
    date: 'Pick-up',
    route: 'Route',
    passengers: 'Passengers',
    passengersCount: '{count} passengers',
    total: 'Total incl. VAT',
    vat: 'incl. 20 % VAT',
    priceOpen: 'To be set',
    returnHeading: 'Return ride',
    returnOpen: 'Open the return ride',
    vehicle: 'Your vehicle',
    driverPending: 'A driver is being assigned',
    driverPendingHint:
      'As soon as a driver has taken the ride, the vehicle appears here.',
    driver: 'Driver',
    documents: 'Documents',
    docOFFER: 'Offer',
    docINVOICE: 'Invoice',
    openPdf: 'Open PDF',
    openInApp: 'Open in the app',
    linkInvalid: 'This link is not valid. Please open the link from your e-mail.',
    network: 'The connection failed. Please try again.',
    retry: 'Try again',
    contact: 'For any question reach us at {phone} or {email}.',
    contactHeading: 'Contact',
    customer: {
      NEW: 'Request received',
      OFFERED: 'Offer received',
      CONFIRMED: 'Confirmed',
      INVOICED: 'Invoice received',
      PAID: 'Paid',
      DECLINED: 'Declined'
    },
    state: {
      PENDING: 'Pending',
      ASSIGNED: 'Assigned',
      REJECTED: 'Rejected',
      ABORTED: 'Aborted',
      ON_THE_WAY: 'On the way',
      AT_PICKUP: 'At pickup',
      NO_SHOW: 'No show',
      FAILED: 'Failed',
      CANCELED: 'Cancelled',
      TERMINATED: 'Terminated',
      ONGOING: 'Ongoing',
      COMPLETED: 'Completed'
    }
  },
  tr: {
    title: 'Yolculuğunuz',
    code: 'Rezervasyon kodu',
    status: 'Durum',
    refresh: 'Yenile',
    loading: 'Yolculuğunuz yükleniyor',
    sectionRide: 'Yolculuk',
    date: 'Alış',
    route: 'Güzergâh',
    passengers: 'Yolcular',
    passengersCount: '{count} yolcu',
    total: 'KDV dahil toplam',
    vat: '% 20 KDV dahil',
    priceOpen: 'Belirlenecek',
    returnHeading: 'Dönüş yolculuğu',
    returnOpen: 'Dönüş yolculuğunu aç',
    vehicle: 'Aracınız',
    driverPending: 'Sürücü atanıyor',
    driverPendingHint:
      'Bir sürücü yolculuğu üstlendiği anda aracı burada göreceksiniz.',
    driver: 'Sürücü',
    documents: 'Belgeler',
    docOFFER: 'Teklif',
    docINVOICE: 'Fatura',
    openPdf: 'PDF aç',
    openInApp: 'Uygulamada aç',
    linkInvalid: 'Bu bağlantı geçersiz. Lütfen bağlantıyı e-postanızdan açın.',
    network: 'Bağlantı kurulamadı. Lütfen tekrar deneyin.',
    retry: 'Tekrar dene',
    contact: 'Sorularınız için bize {phone} veya {email} üzerinden ulaşabilirsiniz.',
    contactHeading: 'İletişim',
    customer: {
      NEW: 'Talep alındı',
      OFFERED: 'Teklif alındı',
      CONFIRMED: 'Onaylandı',
      INVOICED: 'Fatura alındı',
      PAID: 'Ödendi',
      DECLINED: 'Reddedildi'
    },
    state: {
      PENDING: 'Bekliyor',
      ASSIGNED: 'Atandı',
      REJECTED: 'Reddedildi',
      ABORTED: 'Yarıda kesildi',
      ON_THE_WAY: 'Yolda',
      AT_PICKUP: 'Alış noktasında',
      NO_SHOW: 'Gelmedi',
      FAILED: 'Başarısız',
      CANCELED: 'İptal edildi',
      TERMINATED: 'Sonlandırıldı',
      ONGOING: 'Sürüyor',
      COMPLETED: 'Tamamlandı'
    }
  },
  ar: {
    title: 'رحلتكم',
    code: 'رمز الحجز',
    status: 'الحالة',
    refresh: 'تحديث',
    loading: 'جارٍ تحميل الرحلة',
    sectionRide: 'الرحلة',
    date: 'الاستلام',
    route: 'المسار',
    passengers: 'الركاب',
    passengersCount: '{count} ركاب',
    total: 'الإجمالي شامل الضريبة',
    vat: 'شامل ضريبة القيمة المضافة 20 %',
    priceOpen: 'سيتم تحديده',
    returnHeading: 'رحلة العودة',
    returnOpen: 'فتح رحلة العودة',
    vehicle: 'مركبتكم',
    driverPending: 'يتم تعيين سائق',
    driverPendingHint: 'بمجرد أن يتولى سائق الرحلة ستظهر المركبة هنا.',
    driver: 'السائق',
    documents: 'المستندات',
    docOFFER: 'عرض السعر',
    docINVOICE: 'الفاتورة',
    openPdf: 'فتح ملف PDF',
    openInApp: 'الفتح في التطبيق',
    linkInvalid: 'هذا الرابط غير صالح. يرجى فتح الرابط من رسالة البريد الإلكتروني.',
    network: 'فشل الاتصال. يرجى المحاولة مرة أخرى.',
    retry: 'إعادة المحاولة',
    contact: 'لأي استفسار يمكنكم التواصل معنا عبر {phone} أو {email}.',
    contactHeading: 'التواصل',
    customer: {
      NEW: 'تم استلام الطلب',
      OFFERED: 'تم استلام العرض',
      CONFIRMED: 'مؤكد',
      INVOICED: 'تم استلام الفاتورة',
      PAID: 'مدفوع',
      DECLINED: 'مرفوض'
    },
    state: {
      PENDING: 'قيد الانتظار',
      ASSIGNED: 'تم التعيين',
      REJECTED: 'مرفوض',
      ABORTED: 'أُلغي أثناء التنفيذ',
      ON_THE_WAY: 'في الطريق',
      AT_PICKUP: 'عند نقطة الاستلام',
      NO_SHOW: 'لم يحضر',
      FAILED: 'فشل',
      CANCELED: 'ملغى',
      TERMINATED: 'أُنهي',
      ONGOING: 'الرحلة جارية',
      COMPLETED: 'مكتمل'
    }
  }
}

const fill = (text: string, values: Record<string, string>): string =>
  text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`)

/**
 * The formatting locales. Arabic with Latin digits, so the code, the price
 * and the date read as they do on the PDF and in the mail.
 */
const LOCALE: Record<RideLanguage, string> = {
  de: 'de-AT',
  en: 'en-GB',
  tr: 'tr-TR',
  ar: 'ar-EG-u-nu-latn'
}

const formatInstant = (iso: string | null, lang: RideLanguage): string => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(LOCALE[lang], {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Vienna'
  }).format(date)
}

const formatDay = (iso: string | null, lang: RideLanguage): string => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(LOCALE[lang], {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Vienna'
  }).format(date)
}

const formatEuro = (value: number | null, lang: RideLanguage): string => {
  if (value === null) return ''
  return new Intl.NumberFormat(LOCALE[lang], {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

/** The browser's language, reduced to the four the sites speak. German otherwise. */
const browserLanguage = (): RideLanguage => {
  if (typeof navigator === 'undefined') return 'de'
  const code = (navigator.language || '').toLowerCase().slice(0, 2)
  return code === 'en' || code === 'tr' || code === 'ar' ? code : 'de'
}

/**
 * `/fahrt/<token>`. Gatsby hands the splat as `params['*']`, with or without
 * the trailing slash the i18n plugin adds, so both are trimmed before the
 * split. Anything after the token is ignored: this page has one address.
 */
const parseToken = (splat: string | undefined): string => {
  const parts = (splat ?? '')
    .split('/')
    .map(part => part.trim())
    .filter(Boolean)
  return parts[0] ?? ''
}

type Phase = 'loading' | 'ready' | 'error'

const RidePage: React.FC<PageProps> = ({params}) => {
  const token = React.useMemo(
    () => parseToken((params as Record<string, string | undefined>)['*']),
    [params]
  )

  const [phase, setPhase] = React.useState<Phase>('loading')
  const [ride, setRide] = React.useState<RideSummary | null>(null)
  const [refusal, setRefusal] = React.useState<string | null>(null)
  /** A reload with a summary already on the screen keeps the summary. */
  const [refreshing, setRefreshing] = React.useState(false)
  const [fallback, setFallback] = React.useState<RideLanguage>('de')

  // useAuth is jaen's, and the bare layout still sits inside jaen's providers,
  // so the second link can be shown to a customer who is signed in on this
  // browser. A visitor who is not gets the page and nothing missing.
  const {isAuthenticated} = useAuth()

  const load = React.useCallback(
    async (again: boolean) => {
      if (!token) {
        setRefusal('NOT_FOUND')
        setPhase('error')
        return
      }
      if (again) setRefreshing(true)
      else setPhase('loading')
      setRefusal(null)
      try {
        const summary = await rideByToken(token)
        setRide(summary)
        setPhase('ready')
      } catch (error) {
        const code = error instanceof RideError ? error.code : NETWORK
        setRefusal(code)
        // A refused reload keeps what is on the screen and says why under the
        // header; only a first read with nothing to show turns the page over.
        setPhase(ride ? 'ready' : 'error')
      } finally {
        setRefreshing(false)
      }
    },
    [token, ride]
  )

  React.useEffect(() => {
    setFallback(browserLanguage())
    void load(false)
    // The first read only. `load` closes over `ride` so it changes with every
    // answer, and a dependency on it would re-read forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const lang = ride?.language ?? fallback
  const w = WORDS[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  // The phone number inside the sentence is isolated left to right (LRI and
  // PDI), or Arabic mirrors its groups the way it did in the header.
  const contactLine = fill(w.contact, {
    phone: `⁦${SITE.contactPhone}⁩`,
    email: SITE.contactEmail
  })

  const refusalText =
    refusal === null
      ? null
      : refusal === NETWORK
        ? w.network
        : w.linkInvalid

  const accepted = ride?.driverStatus === 'ACCEPTED'

  return (
    <Box
      bg={PAPER.bg}
      color={PAPER.ink}
      minH="100dvh"
      dir={dir}
      lang={lang}
      fontSize="md"
      lineHeight="1.6">
      <Flex
        direction="column"
        maxW="44rem"
        mx="auto"
        minH="100dvh"
        px={{base: 5, md: 10}}
        py={{base: 8, md: 12}}>
        {/* The letterhead: sender line left in small print, the mark right. */}
        <Flex
          as="header"
          justify="space-between"
          align="flex-start"
          gap="6"
          pb="6"
          borderBottomWidth="1px"
          borderColor={PAPER.rule}>
          <Box fontSize="xs" color={PAPER.footer} pt="2">
            <Text fontWeight="semibold" color={PAPER.ink}>
              {SITE.companyName}
            </Text>
            {/* A phone number is left to right in every language, or its groups mirror under rtl. */}
            <Text>
              <Text as="span" dir="ltr">
                {SITE.contactPhone}
              </Text>
            </Text>
            <Text>{SITE.contactEmail}</Text>
          </Box>
          <Box
            flexShrink={0}
            h={{base: '48px', md: '64px'}}
            w={{base: '96px', md: '128px'}}>
            <Logo maxH="none" height="100%" width="100%" />
          </Box>
        </Flex>

        <Box as="main" flex="1" pt="8">
          {phase === 'loading' && (
            <Stack gap="4" role="status" aria-label={w.loading} data-testid="ride-skeleton">
              <Skeleton h="9" w="60%" />
              <Skeleton h="5" w="40%" />
              <Skeleton h="28" />
              <Skeleton h="24" />
              <Skeleton h="11" w="50%" />
            </Stack>
          )}

          {phase === 'error' && (
            <Stack gap="6">
              <Heading as="h1" fontSize="2xl" lineHeight="1.25" fontWeight="bold">
                {w.title}
              </Heading>
              <Notice tone={refusal === NETWORK ? 'neutral' : 'bad'}>
                {refusalText}
              </Notice>
              {refusal === NETWORK && (
                <Box>
                  <ActionButton
                    disabled={false}
                    onClick={() => void load(false)}
                    testId="ride-retry">
                    {w.retry}
                  </ActionButton>
                </Box>
              )}
              <Text color={PAPER.muted}>{contactLine}</Text>
            </Stack>
          )}

          {ride && phase === 'ready' && (
            <Stack gap="7">
              <Stack gap="3">
                <Flex
                  justify="space-between"
                  align="flex-start"
                  gap="4"
                  wrap="wrap">
                  <Stack gap="1" minW="0">
                    {/*
                      The title of the letter, bold at 1.5rem like the offer
                      page's, set explicitly because the site's heading recipe
                      sizes its marketing headlines far larger.
                    */}
                    <Heading
                      as="h1"
                      fontSize="2xl"
                      lineHeight="1.25"
                      fontWeight="bold">
                      {w.title}
                    </Heading>
                    <Text fontSize="sm" color={PAPER.muted}>
                      {w.code}:{' '}
                      <Text
                        as="span"
                        fontWeight="semibold"
                        color={PAPER.ink}
                        data-testid="ride-code">
                        {ride.code}
                      </Text>
                    </Text>
                  </Stack>
                  {/*
                    The refresh button every view of the app carries: a ride's
                    driver, state and documents move while the page is open,
                    and a customer looking at it should not have to know that
                    the browser's own reload is what fetches them.
                  */}
                  <RefreshButton
                    label={w.refresh}
                    busy={refreshing}
                    onClick={() => void load(true)}
                  />
                </Flex>

                {/* The status in the customer's words, beside the ride state. */}
                <Flex gap="2" wrap="wrap" data-testid="ride-status">
                  <Badge>{w.customer[ride.customerStatus] ?? ride.customerStatus}</Badge>
                  <Badge muted>{w.state[ride.state] ?? ride.state}</Badge>
                </Flex>

                {refusalText && <Notice tone="neutral">{refusalText}</Notice>}
              </Stack>

              {/* The ride, the way the offer page lays out its one position. */}
              <Stack
                gap="0"
                borderWidth="1px"
                borderColor={PAPER.rule}
                borderRadius="sm"
                overflow="hidden">
                <Box px="4" py="3" data-testid="ride-details">
                  <Text fontWeight="semibold" mb="1">
                    {w.sectionRide}
                  </Text>
                  <Row label={w.date}>
                    {formatInstant(ride.pickupDateTime, lang)}
                  </Row>
                  <Row label={w.route}>
                    {/*
                      The route reads from the pickup to the dropoff with the
                      arrow between, left to right in every language: the
                      addresses are Latin, and under rtl the arrow would point
                      the wrong way between mirrored halves.
                    */}
                    <Text as="span" dir="ltr" display="inline-block">
                      {ride.pickupLocation}
                      <Text as="span" color={PAPER.muted} px="1.5" aria-hidden="true">
                        →
                      </Text>
                      {ride.dropoffLocation}
                    </Text>
                  </Row>
                  {ride.passengers > 0 && (
                    <Row label={w.passengers}>{String(ride.passengers)}</Row>
                  )}
                </Box>
                <Flex
                  bg={PAPER.rowgray}
                  px="4"
                  py="3"
                  justify="space-between"
                  align="baseline"
                  gap="4"
                  fontWeight="bold"
                  data-testid="ride-total">
                  <Text>
                    {w.total}{' '}
                    <Text
                      as="span"
                      fontWeight="normal"
                      fontSize="sm"
                      color={PAPER.muted}>
                      ({w.vat})
                    </Text>
                  </Text>
                  {ride.price === null ? (
                    <Text fontWeight="normal" color={PAPER.muted}>
                      {w.priceOpen}
                    </Text>
                  ) : (
                    <Text dir="ltr" whiteSpace="nowrap">
                      {formatEuro(ride.price, lang)}
                    </Text>
                  )}
                </Flex>
              </Stack>

              {/*
                "Ihr Fahrzeug" once the driver said yes, with the picture, the
                name, the colour dot and the plate, and the driver's first name
                under it (okf/architecture/media.md). Before the yes the card is
                there but says the driver is being assigned, so the customer
                knows the answer is coming rather than reading a hole.
              */}
              {accepted && ride.car ? (
                <Box
                  borderWidth="1px"
                  borderColor={PAPER.rule}
                  borderRadius="sm"
                  p="4"
                  data-testid="ride-vehicle">
                  <Text fontWeight="semibold" mb="3">
                    {w.vehicle}
                  </Text>
                  <Flex gap="4" align="center" minW="0">
                    <CarPicture car={ride.car} alt={ride.car.licensePlate ?? ''} />
                    <Box minW="0" flex="1">
                      {ride.car.carName && (
                        <Text fontWeight="semibold" lineClamp={1}>
                          {ride.car.carName}
                        </Text>
                      )}
                      <Flex gap="2" align="center" minW="0" mt="1">
                        {ride.car.color && <ColorDot color={ride.car.color} />}
                        {ride.car.licensePlate && (
                          <Text
                            fontFamily="mono"
                            fontWeight="semibold"
                            letterSpacing="wider"
                            dir="ltr">
                            {ride.car.licensePlate}
                          </Text>
                        )}
                      </Flex>
                      {ride.driverFirstName && (
                        <Text fontSize="sm" color={PAPER.muted} mt="1">
                          {w.driver}:{' '}
                          <Text as="span" color={PAPER.ink} fontWeight="medium">
                            {ride.driverFirstName}
                          </Text>
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </Box>
              ) : (
                <Box
                  borderWidth="1px"
                  borderColor={PAPER.rule}
                  borderRadius="sm"
                  p="4"
                  data-testid="ride-driver-pending">
                  <Text fontWeight="semibold">{w.driverPending}</Text>
                  <Text fontSize="sm" color={PAPER.muted} mt="1">
                    {w.driverPendingHint}
                  </Text>
                </Box>
              )}

              {/*
                The offer and the invoice behind the pylon's signed links. The
                link is minted for this read and lives fifteen minutes, so it
                opens in a new tab rather than being copied anywhere.
              */}
              {ride.documents.length > 0 && (
                <Stack gap="3" data-testid="ride-documents">
                  <Text fontWeight="semibold">{w.documents}</Text>
                  {ride.documents.map(doc => (
                    <Flex
                      key={`${doc.kind}-${doc.number ?? doc.url}`}
                      justify="space-between"
                      align="center"
                      gap="3"
                      wrap="wrap"
                      borderWidth="1px"
                      borderColor={PAPER.rule}
                      borderRadius="sm"
                      px="4"
                      py="3"
                      data-testid={`ride-document-${doc.kind.toLowerCase()}`}>
                      <Box minW="0">
                        <Text fontWeight="medium">
                          {doc.kind === 'INVOICE' ? w.docINVOICE : w.docOFFER}
                          {doc.number ? ` ${doc.number}` : ''}
                        </Text>
                        {doc.createdAt && (
                          <Text fontSize="sm" color={PAPER.muted}>
                            {formatDay(doc.createdAt, lang)}
                          </Text>
                        )}
                      </Box>
                      <LinkButton href={doc.url} testId={`ride-open-${doc.kind.toLowerCase()}`}>
                        {w.openPdf}
                      </LinkButton>
                    </Flex>
                  ))}
                </Stack>
              )}

              {/* The return leg, its own ride with its own page. */}
              {ride.returnUrl && (
                <Flex
                  justify="space-between"
                  align="center"
                  gap="3"
                  wrap="wrap"
                  borderWidth="1px"
                  borderColor={PAPER.rule}
                  borderRadius="sm"
                  px="4"
                  py="3"
                  data-testid="ride-return">
                  <Box minW="0">
                    <Text fontWeight="medium">{w.returnHeading}</Text>
                    {ride.returnCode && (
                      <Text fontSize="sm" color={PAPER.muted}>
                        {ride.returnCode}
                      </Text>
                    )}
                  </Box>
                  <LinkButton
                    href={ride.returnUrl}
                    sameTab
                    testId="ride-open-return">
                    {w.returnOpen}
                  </LinkButton>
                </Flex>
              )}

              {/*
                The second link, for a customer who is signed in on this
                browser: the same ride in the app, with the map, the driver's
                colour and the cancel button.
              */}
              {isAuthenticated && ride.appUrl && (
                <Box>
                  <LinkButton
                    href={ride.appUrl}
                    sameTab
                    primary
                    testId="ride-open-app">
                    {w.openInApp}
                  </LinkButton>
                </Box>
              )}

              <Text color={PAPER.muted} fontSize="sm">
                {contactLine}
              </Text>
            </Stack>
          )}
        </Box>

        {/* The grey footer of the letter, the company and how to reach it. */}
        <Flex
          as="footer"
          mt="12"
          pt="5"
          borderTopWidth="1px"
          borderColor={PAPER.rule}
          fontSize="xs"
          color={PAPER.footer}
          gap="8"
          wrap="wrap">
          <Box>
            <Text fontWeight="semibold">{SITE.companyName}</Text>
            <Text>{SITE.siteUrl.replace(/^https?:\/\//, '')}</Text>
          </Box>
          <Box>
            <Text fontWeight="semibold">{w.contactHeading}</Text>
            <Text>
              <a href={`tel:${SITE.contactPhoneTel}`} dir="ltr">
                {SITE.contactPhone}
              </a>
            </Text>
            <Text>
              <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

const Row: React.FC<{label: string; children: React.ReactNode}> = ({
  label,
  children
}) => (
  <Flex gap="3" fontSize="sm" align="baseline">
    <Text color={PAPER.muted} flexShrink={0} minW="6rem">
      {label}
    </Text>
    <Text as="span">{children}</Text>
  </Flex>
)

const Badge: React.FC<{muted?: boolean; children: React.ReactNode}> = ({
  muted,
  children
}) => (
  <Box
    as="span"
    display="inline-block"
    px="2.5"
    py="1"
    borderRadius="sm"
    fontSize="sm"
    fontWeight="medium"
    bg={muted ? 'transparent' : PAPER.rowgray}
    borderWidth={muted ? '1px' : '0'}
    borderColor={PAPER.rule}
    color={muted ? PAPER.muted : PAPER.ink}>
    {children}
  </Box>
)

const Notice: React.FC<{
  tone: 'good' | 'bad' | 'neutral'
  children: React.ReactNode
}> = ({tone, children}) => (
  <Box
    role="status"
    data-testid={`ride-notice-${tone}`}
    borderInlineStartWidth="4px"
    borderColor={
      tone === 'good' ? PAPER.gold : tone === 'bad' ? PAPER.red : PAPER.footer
    }
    bg={PAPER.rowgray}
    px="4"
    py="3"
    fontWeight="medium">
    {children}
  </Box>
)

/**
 * The colour the dispatcher gave the car, as the dot the app draws beside a
 * plate. A value that is not a hex colour draws nothing rather than a broken
 * swatch: the colour is decoration and a missing one must not cost the plate.
 */
const ColorDot: React.FC<{color: string}> = ({color}) => {
  if (!/^#[0-9a-fA-F]{6}$/.test(color.trim())) return null
  return (
    <Box
      as="span"
      flexShrink={0}
      w="3"
      h="3"
      borderRadius="full"
      bg={color.trim()}
      borderWidth="1px"
      borderColor={PAPER.rule}
      aria-hidden="true"
    />
  )
}

/**
 * The car's picture, the thumbnail where there is one and the silhouette of
 * its class where there is none, drawn here rather than through the app's
 * CarImage because this page carries no app runtime and no icon package.
 */
const CarPicture: React.FC<{
  car: {imageUrl: string | null; imageThumbUrl: string | null; carClass: string | null}
  alt: string
}> = ({car, alt}) => {
  const src = car.imageThumbUrl ?? car.imageUrl ?? null
  return (
    <Box
      flexShrink={0}
      w="96px"
      h="96px"
      borderRadius="sm"
      borderWidth="1px"
      borderColor={PAPER.rule}
      bg={PAPER.rowgray}
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      data-testid="ride-vehicle-image">
      {src ? (
        <img
          src={src}
          alt={alt}
          width={96}
          height={96}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ) : (
        // A plain svg, not Chakra's Box as="svg": the polymorphic Box types
        // its props as a div's and rejects viewBox outright.
        <svg viewBox="0 0 24 24" width="48" height="48" fill={PAPER.footer} aria-hidden="true">
          <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1zm2.1 0h9.8l-1.1-3.4a.5.5 0 0 0-.5-.35H8.7a.5.5 0 0 0-.5.35L7.1 11zM7 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      )}
    </Box>
  )
}

/** The refresh button of every app view, at a thumb's hit area. */
const RefreshButton: React.FC<{
  label: string
  busy: boolean
  onClick: () => void
}> = ({label, busy, onClick}) => (
  <Button
    onClick={onClick}
    disabled={busy}
    size="sm"
    minH="44px"
    px="4"
    variant="outline"
    color={PAPER.ink}
    borderColor={PAPER.rule}
    bg="transparent"
    _hover={{bg: PAPER.rowgray}}
    aria-label={label}
    data-testid="ride-refresh">
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      style={{
        marginInlineEnd: '0.5rem',
        // The read in flight dims the arrow. A keyframe would be nicer and
        // this page defines none: it carries the letterhead's own colours and
        // no theme of the site, so a named animation would resolve to nothing.
        opacity: busy ? 0.5 : 1
      }}>
      <path d="M12 5V2L8 6l4 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
    </svg>
    {label}
  </Button>
)

const ActionButton: React.FC<{
  disabled: boolean
  onClick: () => void
  testId: string
  children: React.ReactNode
}> = ({disabled, onClick, testId, children}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    size="lg"
    minH="44px"
    w={{base: 'full', sm: 'auto'}}
    minW={{sm: '12rem'}}
    variant="solid"
    bg={PAPER.gold}
    color="black"
    borderColor={PAPER.gold}
    _hover={{bg: PAPER.goldHover}}
    _active={{bg: PAPER.goldActive}}
    data-testid={testId}>
    {children}
  </Button>
)

/**
 * A link that looks like a button. A document's signed link opens in a new
 * tab, an address on this site stays in it.
 */
const LinkButton: React.FC<{
  href: string
  testId: string
  primary?: boolean
  sameTab?: boolean
  children: React.ReactNode
}> = ({href, testId, primary, sameTab, children}) => (
  <Button
    asChild
    size="sm"
    minH="44px"
    px="4"
    variant={primary ? 'solid' : 'outline'}
    bg={primary ? PAPER.gold : 'transparent'}
    color={primary ? 'black' : PAPER.ink}
    borderColor={primary ? PAPER.gold : PAPER.ink}
    _hover={{bg: primary ? PAPER.goldHover : PAPER.rowgray}}
    _active={{bg: primary ? PAPER.goldActive : PAPER.rowgray}}
    data-testid={testId}>
    <a
      href={href}
      target={sameTab ? undefined : '_blank'}
      rel={sameTab ? undefined : 'noreferrer noopener'}>
      {children}
    </a>
  </Button>
)

export default RidePage

export const pageConfig: PageConfig = {
  label: 'Fahrt',
  withoutJaenFrame: true,
  layout: {
    name: 'jaen',
    type: 'bare'
  }
}

export {Head} from 'jaen'
