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
import {PageConfig} from 'jaen'

import {Logo} from '../../gatsby-plugin-jaen/components/Logo'
import {SITE} from '../../vars/site-variants'
import {
  confirmOffer,
  declineOffer,
  offerByToken,
  NETWORK,
  OfferError,
  type OfferAction,
  type OfferLanguage,
  type OfferSummary
} from '../../services/offer'

/**
 * The customer's answer to an offer.
 *
 * The offer mail carries two links here, `/angebot/<token>` for Bestätigen
 * and `/angebot/<token>/ablehnen` for Ablehnen. The page is bare, on the
 * letterhead the offer PDF is set on: white paper, the logo top right, the
 * sender line in small print, the bold title with the number, the code and
 * the validity, the ride with its date and route, the grey total row and
 * the grey footer. It reads the offer's summary through the public
 * `offerByToken`, shows the button the link is for, and calls the public
 * `confirmOffer` or `declineOffer` with the token from the url. Nothing
 * here needs an account.
 *
 * One link, one button. The pylon signs the action into the token, so the
 * confirm link cannot decline and the decline link cannot confirm (the
 * other call answers OFFER_LINK_INVALID). The page therefore shows the
 * button of the action the summary names, and a line that says the other
 * answer is the other link in the mail. Two buttons that both work off one
 * token would need the pylon to sign one token for both actions.
 *
 * Every word is in the booking's language, which the summary carries, so a
 * Turkish booking gets a Turkish page whatever the visitor's browser says.
 * Until the summary is there, and on a link the pylon refuses, the browser's
 * language decides, reduced to the four the sites speak, German otherwise.
 * Arabic is right to left.
 *
 * The refused states are in words rather than codes: a link past its
 * expiry (`OFFER_EXPIRED`), a link that names nothing or was tampered with
 * (`OFFER_LINK_INVALID`), an offer already confirmed that the decline link
 * meets (`OFFER_CONFIRMED`), an offer already declined that the confirm
 * link meets (`OFFER_DECLINED`), an offer the 24 hour rule cancelled, and a
 * transport failure with a retry. A confirmation is idempotent on the
 * pylon, so a second visit of the confirm link shows the confirmed page and
 * not an error.
 *
 * The page has no colour mode. It sits outside the routes that carry one,
 * see gatsby-plugin-jaen's color-mode-scope, so it is forced light, and the
 * colours below are the letterhead's own rather than the site's tokens: the
 * paper is white whatever the brand's app looks like.
 */

/** The letterhead's colours, the same values letter.typ uses. */
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

interface Words {
  title: string
  titleWithoutNumber: string
  code: string
  validUntil: string
  intro: string
  declineIntro: string
  date: string
  route: string
  total: string
  vat: string
  terms: string
  confirm: string
  decline: string
  otherLinkConfirm: string
  otherLinkDecline: string
  working: string
  retry: string
  confirmed: string
  confirmedHint: string
  alreadyConfirmed: string
  declined: string
  alreadyDeclined: string
  lapsed: string
  linkExpired: string
  linkInvalid: string
  declineRefused: string
  confirmRefused: string
  notOffered: string
  network: string
  contact: string
  loading: string
  contactHeading: string
}

/** German first, like every product string. */
const WORDS: Record<OfferLanguage, Words> = {
  de: {
    title: 'Angebot Nr. {number}',
    titleWithoutNumber: 'Ihr Angebot',
    code: 'Buchungscode',
    validUntil: 'Gültig bis',
    intro:
      'Vielen Dank für Ihre Anfrage. Bitte prüfen Sie Ihr Angebot und bestätigen Sie Ihre Fahrt.',
    declineIntro: 'Möchten Sie dieses Angebot ablehnen?',
    date: 'Datum',
    route: 'Strecke',
    total: 'Gesamtbetrag brutto',
    vat: 'inkl. 20 % USt.',
    terms:
      'Die Fahrt ist erst mit Ihrer Bestätigung gebucht. Die Preise verstehen sich inklusive Umsatzsteuer, Wartezeiten und Umwege werden nach Aufwand berechnet.',
    confirm: 'Bestätigen',
    decline: 'Ablehnen',
    otherLinkConfirm:
      'Zum Bestätigen verwenden Sie bitte den Link „Angebot bestätigen“ in Ihrer E-Mail.',
    otherLinkDecline:
      'Zum Ablehnen verwenden Sie bitte den Link „Angebot ablehnen“ in Ihrer E-Mail.',
    working: 'Wird gesendet',
    retry: 'Erneut versuchen',
    confirmed: 'Vielen Dank! Ihre Fahrt {code} ist bestätigt.',
    confirmedHint:
      'Sie erhalten eine Bestätigung per E-Mail. Wir freuen uns auf Sie.',
    alreadyConfirmed: 'Dieses Angebot ist bereits bestätigt.',
    declined: 'Sie haben das Angebot abgelehnt.',
    alreadyDeclined: 'Dieses Angebot wurde abgelehnt.',
    lapsed:
      'Dieses Angebot ist verfallen. Die Fahrt wurde nicht rechtzeitig bestätigt und ist storniert.',
    linkExpired:
      'Dieser Link ist abgelaufen. Das Angebot kann über diesen Link nicht mehr beantwortet werden.',
    linkInvalid:
      'Dieser Link ist ungültig. Bitte öffnen Sie den Link aus Ihrer E-Mail.',
    declineRefused:
      'Das Angebot wurde bereits bestätigt und kann nicht mehr abgelehnt werden.',
    confirmRefused:
      'Das Angebot wurde bereits abgelehnt und kann nicht mehr bestätigt werden.',
    notOffered: 'Für diese Fahrt liegt noch kein Angebot vor.',
    network:
      'Die Verbindung ist fehlgeschlagen. Bitte versuchen Sie es noch einmal.',
    contact: 'Bei Fragen erreichen Sie uns unter {phone} oder {email}.',
    loading: 'Angebot wird geladen',
    contactHeading: 'Kontakt'
  },
  en: {
    title: 'Offer no. {number}',
    titleWithoutNumber: 'Your offer',
    code: 'Booking code',
    validUntil: 'Valid until',
    intro:
      'Thank you for your enquiry. Please check your offer and confirm your ride.',
    declineIntro: 'Would you like to decline this offer?',
    date: 'Date',
    route: 'Route',
    total: 'Total incl. VAT',
    vat: 'incl. 20 % VAT',
    terms:
      'The ride is booked once you have confirmed. Prices include VAT, waiting times and detours are charged as incurred.',
    confirm: 'Confirm',
    decline: 'Decline',
    otherLinkConfirm: 'To confirm, please use the link "Confirm offer" in your e-mail.',
    otherLinkDecline: 'To decline, please use the link "Decline offer" in your e-mail.',
    working: 'Sending',
    retry: 'Try again',
    confirmed: 'Thank you! Your ride {code} is confirmed.',
    confirmedHint:
      'You will receive a confirmation by e-mail. We look forward to seeing you.',
    alreadyConfirmed: 'This offer has already been confirmed.',
    declined: 'You have declined the offer.',
    alreadyDeclined: 'This offer has been declined.',
    lapsed:
      'This offer has lapsed. The ride was not confirmed in time and has been cancelled.',
    linkExpired:
      'This link has expired. The offer can no longer be answered through it.',
    linkInvalid: 'This link is not valid. Please open the link from your e-mail.',
    declineRefused:
      'The offer has already been confirmed and can no longer be declined.',
    confirmRefused:
      'The offer has already been declined and can no longer be confirmed.',
    notOffered: 'No offer has been made for this ride yet.',
    network: 'The connection failed. Please try again.',
    contact: 'For any question reach us at {phone} or {email}.',
    loading: 'Loading your offer',
    contactHeading: 'Contact'
  },
  tr: {
    title: 'Teklif No. {number}',
    titleWithoutNumber: 'Teklifiniz',
    code: 'Rezervasyon kodu',
    validUntil: 'Geçerlilik tarihi',
    intro:
      'Talebiniz için teşekkür ederiz. Lütfen teklifinizi kontrol edin ve yolculuğunuzu onaylayın.',
    declineIntro: 'Bu teklifi reddetmek istiyor musunuz?',
    date: 'Tarih',
    route: 'Güzergâh',
    total: 'KDV dahil toplam',
    vat: '% 20 KDV dahil',
    terms:
      'Yolculuk ancak onayınızla rezerve edilmiş sayılır. Fiyatlara KDV dahildir, bekleme süreleri ve ek güzergâhlar ayrıca ücretlendirilir.',
    confirm: 'Onayla',
    decline: 'Reddet',
    otherLinkConfirm:
      'Onaylamak için lütfen e-postanızdaki "Teklifi onayla" bağlantısını kullanın.',
    otherLinkDecline:
      'Reddetmek için lütfen e-postanızdaki "Teklifi reddet" bağlantısını kullanın.',
    working: 'Gönderiliyor',
    retry: 'Tekrar dene',
    confirmed: 'Teşekkürler! {code} yolculuğunuz onaylandı.',
    confirmedHint:
      'E-posta ile bir onay alacaksınız. Sizi ağırlamayı dört gözle bekliyoruz.',
    alreadyConfirmed: 'Bu teklif zaten onaylanmış.',
    declined: 'Teklifi reddettiniz.',
    alreadyDeclined: 'Bu teklif reddedilmiş.',
    lapsed:
      'Bu teklifin süresi doldu. Yolculuk zamanında onaylanmadığı için iptal edildi.',
    linkExpired:
      'Bu bağlantının süresi dolmuş. Teklif artık bu bağlantı üzerinden yanıtlanamaz.',
    linkInvalid:
      'Bu bağlantı geçersiz. Lütfen bağlantıyı e-postanızdan açın.',
    declineRefused: 'Teklif zaten onaylandığı için artık reddedilemez.',
    confirmRefused: 'Teklif zaten reddedildiği için artık onaylanamaz.',
    notOffered: 'Bu yolculuk için henüz bir teklif yok.',
    network: 'Bağlantı kurulamadı. Lütfen tekrar deneyin.',
    contact: 'Sorularınız için bize {phone} veya {email} üzerinden ulaşabilirsiniz.',
    loading: 'Teklifiniz yükleniyor',
    contactHeading: 'İletişim'
  },
  ar: {
    title: 'عرض سعر رقم {number}',
    titleWithoutNumber: 'عرضكم',
    code: 'رمز الحجز',
    validUntil: 'صالح حتى',
    intro: 'شكراً لاستفساركم. يرجى مراجعة العرض وتأكيد رحلتكم.',
    declineIntro: 'هل ترغبون في رفض هذا العرض؟',
    date: 'التاريخ',
    route: 'المسار',
    total: 'الإجمالي شامل الضريبة',
    vat: 'شامل ضريبة القيمة المضافة 20 %',
    terms:
      'لا تعتبر الرحلة محجوزة إلا بعد تأكيدكم. الأسعار شاملة ضريبة القيمة المضافة، ويتم احتساب أوقات الانتظار والمسارات الإضافية حسب الاستخدام.',
    confirm: 'تأكيد',
    decline: 'رفض',
    otherLinkConfirm: 'للتأكيد، يرجى استخدام رابط "تأكيد العرض" في رسالة البريد الإلكتروني.',
    otherLinkDecline: 'للرفض، يرجى استخدام رابط "رفض العرض" في رسالة البريد الإلكتروني.',
    working: 'جارٍ الإرسال',
    retry: 'إعادة المحاولة',
    confirmed: 'شكراً لكم! تم تأكيد رحلتكم {code}.',
    confirmedHint: 'ستصلكم رسالة تأكيد بالبريد الإلكتروني. نتطلع إلى لقائكم.',
    alreadyConfirmed: 'تم تأكيد هذا العرض من قبل.',
    declined: 'لقد رفضتم العرض.',
    alreadyDeclined: 'تم رفض هذا العرض.',
    lapsed: 'انتهت صلاحية هذا العرض. لم يتم تأكيد الرحلة في الوقت المحدد وتم إلغاؤها.',
    linkExpired:
      'انتهت صلاحية هذا الرابط. لم يعد بالإمكان الرد على العرض من خلاله.',
    linkInvalid: 'هذا الرابط غير صالح. يرجى فتح الرابط من رسالة البريد الإلكتروني.',
    declineRefused: 'تم تأكيد العرض من قبل ولم يعد بالإمكان رفضه.',
    confirmRefused: 'تم رفض العرض من قبل ولم يعد بالإمكان تأكيده.',
    notOffered: 'لا يوجد عرض لهذه الرحلة بعد.',
    network: 'فشل الاتصال. يرجى المحاولة مرة أخرى.',
    contact: 'لأي استفسار يمكنكم التواصل معنا عبر {phone} أو {email}.',
    loading: 'جارٍ تحميل العرض',
    contactHeading: 'التواصل'
  }
}

const fill = (text: string, values: Record<string, string>): string =>
  text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`)

/**
 * The formatting locales. Arabic with Latin digits, so the code, the price
 * and the date read as they do on the PDF and in the mail.
 */
const LOCALE: Record<OfferLanguage, string> = {
  de: 'de-AT',
  en: 'en-GB',
  tr: 'tr-TR',
  ar: 'ar-EG-u-nu-latn'
}

const formatInstant = (iso: string | null, lang: OfferLanguage): string => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(LOCALE[lang], {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/Vienna'
  }).format(date)
}

const formatEuro = (value: number | null, lang: OfferLanguage): string => {
  if (value === null) return ''
  return new Intl.NumberFormat(LOCALE[lang], {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

/** The browser's language, reduced to the four the sites speak. German otherwise. */
const browserLanguage = (): OfferLanguage => {
  if (typeof navigator === 'undefined') return 'de'
  const code = (navigator.language || '').toLowerCase().slice(0, 2)
  return code === 'en' || code === 'tr' || code === 'ar' ? code : 'de'
}

/**
 * `/angebot/<token>` and `/angebot/<token>/ablehnen`. Gatsby hands the
 * splat as `params['*']`, with or without the trailing slash the i18n plugin
 * adds, so both are trimmed before the split. The suffix names the action
 * until the summary arrives with the one the token really carries.
 */
const parseRoute = (
  splat: string | undefined
): {token: string; action: OfferAction} => {
  const parts = (splat ?? '')
    .split('/')
    .map(part => part.trim())
    .filter(Boolean)
  return {
    token: parts[0] ?? '',
    action: parts[1] === 'ablehnen' ? 'decline' : 'confirm'
  }
}

type Phase = 'loading' | 'ready' | 'working' | 'error'

interface Refusal {
  code: string
  /** Which call was refused, so a refused button keeps the summary. */
  during: 'read' | OfferAction
}

/**
 * A declined ride whose decline came at or after its validity is the 24
 * hour rule's doing, the same test the pylon makes before it refuses a
 * confirmation with OFFER_EXPIRED. A decline before that is the customer's.
 */
const lapsed = (offer: OfferSummary): boolean => {
  if (offer.customerStatus !== 'DECLINED' || !offer.validUntil) return false
  const until = new Date(offer.validUntil).getTime()
  const at = offer.statusAt ? new Date(offer.statusAt).getTime() : Date.now()
  return Number.isFinite(until) && Number.isFinite(at) && at >= until
}

const OfferPage: React.FC<PageProps> = ({params}) => {
  const route = React.useMemo(
    () => parseRoute((params as Record<string, string | undefined>)['*']),
    [params]
  )

  const [phase, setPhase] = React.useState<Phase>('loading')
  const [offer, setOffer] = React.useState<OfferSummary | null>(null)
  const [refusal, setRefusal] = React.useState<Refusal | null>(null)
  /** What the visitor did on this page, as opposed to what the row says. */
  const [answered, setAnswered] = React.useState<OfferAction | null>(null)
  const [fallback, setFallback] = React.useState<OfferLanguage>('de')

  const load = React.useCallback(async () => {
    if (!route.token) {
      setRefusal({code: 'OFFER_LINK_INVALID', during: 'read'})
      setPhase('error')
      return
    }
    setPhase('loading')
    setRefusal(null)
    try {
      const summary = await offerByToken(route.token)
      setOffer(summary)
      setPhase('ready')
    } catch (error) {
      const code = error instanceof OfferError ? error.code : NETWORK
      setRefusal({code, during: 'read'})
      setPhase('error')
    }
  }, [route.token])

  React.useEffect(() => {
    setFallback(browserLanguage())
    void load()
  }, [load])

  const action: OfferAction = offer?.action ?? route.action

  const answer = async () => {
    setPhase('working')
    setRefusal(null)
    try {
      const summary =
        action === 'confirm'
          ? await confirmOffer(route.token)
          : await declineOffer(route.token)
      setOffer(summary)
      setAnswered(action)
      setPhase('ready')
    } catch (error) {
      const code = error instanceof OfferError ? error.code : NETWORK
      setRefusal({code, during: action})
      setPhase('ready')
    }
  }

  const lang = offer?.language ?? fallback
  const w = WORDS[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  // The phone number inside the sentence is isolated left to right (LRI and
  // PDI), or Arabic mirrors its groups the way it did in the header.
  const contactLine = fill(w.contact, {
    phone: `\u2066${SITE.contactPhone}\u2069`,
    email: SITE.contactEmail
  })

  const status = offer?.customerStatus
  const settled =
    status === 'CONFIRMED' || status === 'INVOICED' || status === 'PAID'
  const gone = status === 'DECLINED'
  const notYet = status === 'NEW'

  /**
   * The one sentence that says where the offer stands. Order matters: what
   * the visitor just did outranks what the row said before, and a refusal
   * of the read outranks everything because there is no row to speak of.
   */
  const outcome = ((): {tone: 'good' | 'bad' | 'neutral'; text: string} | null => {
    if (refusal?.during === 'read') {
      if (refusal.code === 'OFFER_EXPIRED') return {tone: 'bad', text: w.linkExpired}
      if (refusal.code === NETWORK) return {tone: 'neutral', text: w.network}
      return {tone: 'bad', text: w.linkInvalid}
    }
    if (!offer) return null
    if (answered === 'confirm') {
      return {tone: 'good', text: fill(w.confirmed, {code: offer.code})}
    }
    if (answered === 'decline') return {tone: 'neutral', text: w.declined}
    if (settled) return {tone: 'good', text: w.alreadyConfirmed}
    if (gone) return {tone: 'bad', text: lapsed(offer) ? w.lapsed : w.alreadyDeclined}
    if (notYet) return {tone: 'neutral', text: w.notOffered}
    return null
  })()

  /** A refused button keeps the summary on the page and says why below it. */
  const refusedAction = ((): string | null => {
    if (!refusal || refusal.during === 'read') return null
    switch (refusal.code) {
      case NETWORK:
        return w.network
      case 'OFFER_EXPIRED':
        return w.lapsed
      case 'OFFER_CONFIRMED':
        return w.declineRefused
      case 'OFFER_DECLINED':
        return w.confirmRefused
      case 'INVALID_TRANSITION':
        return w.notOffered
      default:
        return w.linkInvalid
    }
  })()

  const showButton =
    Boolean(offer) && !settled && !gone && !notYet && answered === null
  const working = phase === 'working'

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
            <Stack gap="4" role="status" aria-label={w.loading}>
              <Skeleton h="9" w="60%" />
              <Skeleton h="5" w="40%" />
              <Skeleton h="5" w="90%" />
              <Skeleton h="24" />
              <Skeleton h="11" w="50%" />
            </Stack>
          )}

          {phase !== 'loading' && !offer && outcome && (
            <Stack gap="6">
              <Heading as="h1" fontSize="2xl" lineHeight="1.25" fontWeight="bold">
                {w.titleWithoutNumber}
              </Heading>
              <Notice tone={outcome.tone}>{outcome.text}</Notice>
              {refusal?.code === NETWORK && (
                <Box>
                  <ActionButton
                    primary
                    disabled={false}
                    onClick={() => void load()}
                    testId="offer-retry">
                    {w.retry}
                  </ActionButton>
                </Box>
              )}
              <Text color={PAPER.muted}>{contactLine}</Text>
            </Stack>
          )}

          {offer && (
            <Stack gap="7">
              <Stack gap="1">
                {/*
                  The title of the letter, bold at 1.5rem like the PDF's,
                  set explicitly because the site's heading recipe sizes
                  its marketing headlines far larger. The number never
                  wraps: "AN-" on one line and the digits on the next is
                  not a number anybody can read.
                */}
                <Heading as="h1" fontSize="2xl" lineHeight="1.25" fontWeight="bold">
                  {offer.number ? (
                    <>
                      {fill(w.title, {number: ''}).trim()}{' '}
                      <Text as="span" whiteSpace="nowrap">
                        {offer.number}
                      </Text>
                    </>
                  ) : (
                    w.titleWithoutNumber
                  )}
                </Heading>
                <Flex
                  gap={{base: 1, sm: 6}}
                  direction={{base: 'column', sm: 'row'}}
                  fontSize="sm"
                  color={PAPER.muted}>
                  <Text>
                    {w.code}:{' '}
                    <Text
                      as="span"
                      fontWeight="semibold"
                      color={PAPER.ink}
                      data-testid="offer-code">
                      {offer.code}
                    </Text>
                  </Text>
                  {offer.validUntil && (
                    <Text>
                      {w.validUntil}:{' '}
                      <Text as="span" fontWeight="semibold" color={PAPER.ink}>
                        {formatInstant(offer.validUntil, lang)}
                      </Text>
                    </Text>
                  )}
                </Flex>
              </Stack>

              {outcome ? (
                <Notice tone={outcome.tone}>{outcome.text}</Notice>
              ) : (
                <Text>{action === 'decline' ? w.declineIntro : w.intro}</Text>
              )}

              {/* The ride, the way the PDF has it as the one position. */}
              <Stack
                gap="0"
                borderWidth="1px"
                borderColor={PAPER.rule}
                borderRadius="sm"
                overflow="hidden">
                <Box px="4" py="3" data-testid="offer-ride">
                  <Text fontWeight="semibold">{offer.code}</Text>
                  <Row label={w.date}>
                    {formatInstant(offer.pickupDateTime, lang)}
                  </Row>
                  <Row label={w.route}>
                    {/*
                      The route reads from the pickup to the dropoff with
                      the arrow between, left to right in every language:
                      the addresses are Latin, and under rtl the arrow
                      would point the wrong way between mirrored halves.
                    */}
                    <Text as="span" dir="ltr" display="inline-block">
                      {offer.pickupLocation}
                      <Text as="span" color={PAPER.muted} px="1.5" aria-hidden="true">
                        →
                      </Text>
                      {offer.dropoffLocation}
                    </Text>
                  </Row>
                </Box>
                {offer.total !== null && (
                  <Flex
                    bg={PAPER.rowgray}
                    px="4"
                    py="3"
                    justify="space-between"
                    align="baseline"
                    gap="4"
                    fontWeight="bold"
                    data-testid="offer-total">
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
                    <Text dir="ltr" whiteSpace="nowrap">
                      {formatEuro(offer.total, lang)}
                    </Text>
                  </Flex>
                )}
              </Stack>

              {showButton && (
                <Stack gap="4">
                  <Text fontSize="sm" color={PAPER.muted}>
                    {w.terms}
                  </Text>
                  {/*
                    One button, the action the token signs, at least 44 px
                    high and full width below sm. The other answer is the
                    other link in the mail, and the line below says so.
                  */}
                  <Box>
                    <ActionButton
                      primary
                      disabled={working}
                      onClick={() => void answer()}
                      testId={action === 'confirm' ? 'offer-confirm' : 'offer-decline'}>
                      {working
                        ? `${w.working}…`
                        : action === 'confirm'
                          ? w.confirm
                          : w.decline}
                    </ActionButton>
                  </Box>
                  <Text fontSize="sm" color={PAPER.muted} data-testid="offer-other-link">
                    {action === 'confirm' ? w.otherLinkDecline : w.otherLinkConfirm}
                  </Text>
                  {refusedAction && <Notice tone="bad">{refusedAction}</Notice>}
                </Stack>
              )}

              {answered === 'confirm' && (
                <Text color={PAPER.muted}>{w.confirmedHint}</Text>
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
    <Text color={PAPER.muted} flexShrink={0} minW="5rem">
      {label}
    </Text>
    <Text as="span">{children}</Text>
  </Flex>
)

const Notice: React.FC<{
  tone: 'good' | 'bad' | 'neutral'
  children: React.ReactNode
}> = ({tone, children}) => (
  <Box
    role="status"
    data-testid={`offer-notice-${tone}`}
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

const ActionButton: React.FC<{
  primary: boolean
  disabled: boolean
  onClick: () => void
  testId: string
  children: React.ReactNode
}> = ({primary, disabled, onClick, testId, children}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    size="lg"
    minH="44px"
    w={{base: 'full', sm: 'auto'}}
    minW={{sm: '12rem'}}
    variant={primary ? 'solid' : 'outline'}
    bg={primary ? PAPER.gold : 'transparent'}
    color={primary ? 'black' : PAPER.ink}
    borderColor={primary ? PAPER.gold : PAPER.ink}
    _hover={{bg: primary ? PAPER.goldHover : PAPER.rowgray}}
    _active={{bg: primary ? PAPER.goldActive : PAPER.rowgray}}
    data-testid={testId}>
    {children}
  </Button>
)

export default OfferPage

export const pageConfig: PageConfig = {
  label: 'Angebot',
  withoutJaenFrame: true,
  layout: {
    name: 'jaen',
    type: 'bare'
  }
}

export {Head} from 'jaen'
