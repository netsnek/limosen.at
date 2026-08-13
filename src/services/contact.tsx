// src/services/contact.tsx
import React, { useMemo } from "react"
import { sendTemplateMail } from "gatsby-jaen-emailwerk"
import { CONTACT_TEMPLATE_ID } from "./mail-templates"
import { useLocation } from "@reach/router"
import { ContactFormValues, ContactModal } from "../components/ContactModal/ContactModal"
import { useAuth, useNotificationsContext } from "jaen"
import { useQueryRouter } from "../hooks/use-query-router"
import { useT } from "../contexts/language"

export interface ContactModalContextProps {
  onOpen: (args?: { meta?: Record<string, any> }) => void
  onClose: () => void
}

export const ContactModalContext =
  React.createContext<ContactModalContextProps | undefined>(undefined)

export const useContactModal = () => {
  const context = React.useContext(ContactModalContext)
  if (!context) {
    throw new Error("useContactModal must be used within a ContactModalProvider")
  }
  return context
}

export interface ContactModalDrawerProps {
  children: React.ReactNode
}

export const ContactModalProvider: React.FC<ContactModalDrawerProps> = ({ children }) => {
  const t = useT()
  const location = useLocation()
  const { isCalled, paramValue } = useQueryRouter(location, "contact")

  const [meta, setMeta] = React.useState<Record<string, any> | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  // v3 dropped useToast for a store whose create() reads `type`, not `status`.
  // jaen's notifications context wraps that store back up in v2's option shape
  // and is already mounted above every page, so the calls below keep the
  // placement, timing and close button they had.
  const { toast } = useNotificationsContext()
  const authentication = useAuth()

  const getCurrentUrl = React.useCallback(() => {
    if (typeof window !== "undefined" && window.location) {
      return window.location.href
    }
    const pathname = location?.pathname ?? "/"
    const search = location?.search ?? ""
    const hash = location?.hash ?? ""
    return `${pathname}${search}${hash}`
  }, [location])

  React.useEffect(() => {
    if (isCalled) {
      setMeta(prev => ({ ...prev, url: getCurrentUrl() }))
      setIsOpen(true)
    }
  }, [isCalled, getCurrentUrl])

  const onOpen: ContactModalContextProps["onOpen"] = (args) => {
    const updatedMeta = {
      ...meta,
      url: getCurrentUrl(),
      ...args?.meta,
    }
    setMeta(updatedMeta)
    setIsOpen(true)
  }

  const onClose = () => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.delete("contact")
      window.history.replaceState({}, "", url.toString())
    }
    setIsOpen(false)
  }

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    const invokedOnUrl = meta?.url ?? getCurrentUrl() ?? "unknown"

    // `ok` rather than `errors`: the client reports a transport or validation
    // failure through the flag, and only a GraphQL error also fills `errors`. The
    // old check therefore showed the success toast for every non-GraphQL failure.
    const { ok } = await sendTemplateMail(
      CONTACT_TEMPLATE_ID,
      {
        envelope: {
          replyTo: data.email,
        },
        values: {
          // Contact
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || "",
          message: data.message,

          // Meta
          invokedOnUrl,
        },
      }
    )

    if (!ok) {
      toast({
        title: t("ToastErrorTitle", "Error"),
        description: t("ToastErrorDesc", "Something went wrong."),
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } else {
      toast({
        title: t("ToastSuccessTitle", "Success"),
        description: t("ToastSuccessDesc", "Your reservation request has been sent successfully."),
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      onClose()
    }
  }

  const fixedValues = useMemo(() => {
    if (!authentication.user) {
      return undefined
    }
    return {
      firstName: authentication.user.profile?.given_name,
      lastName: authentication.user.profile?.family_name,
      email: authentication.user.profile?.email,
      phone: authentication.user.profile?.phone_number,
    }
  }, [authentication.user])

  const defaultValues = useMemo(() => {
    if (!isCalled) {
      return undefined
    }
    return {
      message: paramValue,
    }
  }, [isCalled, paramValue])

  return (
    <ContactModalContext.Provider value={{ onOpen, onClose }}>
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
