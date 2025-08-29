// contact.tsx
import React, { useMemo } from "react"
import { useToast } from "@chakra-ui/react"
import { sendTemplateMail } from "gatsby-jaen-mailpress"
import { useLocation } from "@reach/router"
import { ContactFormValues, ContactModal } from "../components/ContactModal/ContactModal"
import { useAuth } from "jaen"
import { useQueryRouter } from "../hooks/use-query-router"

export interface ContactModalContextProps {
  onOpen: (args?: { meta?: Record<string, any> }) => void
  onClose: () => void
}

export const ContactModalContext =
  React.createContext<ContactModalContextProps>({
    onOpen: () => {},
    onClose: () => {},
  })

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
  // Use the current location from @reach/router.
  const location = useLocation()
  const { isCalled, paramValue } = useQueryRouter(location, "contact")

  const [meta, setMeta] = React.useState<Record<string, any> | null>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  const toast = useToast()
  const authentication = useAuth()

  // Helper: always get a full URL (incl. protocol, domain, path, search, hash) and guard SSR
  const getCurrentUrl = React.useCallback(() => {
    if (typeof window !== "undefined" && window.location) {
      // Prefer the full href; this includes search and hash even on root "/"
      return window.location.href
    }
    // SSR-safe fallback using @reach/router location
    const pathname = location?.pathname ?? "/"
    const search = location?.search ?? ""
    const hash = location?.hash ?? ""
    return `${pathname}${search}${hash}`
  }, [location])

  // When the query parameter is present, open the modal AND set meta.url
  React.useEffect(() => {
    if (isCalled) {
      setMeta(prev => ({ ...prev, url: getCurrentUrl() }))
      setIsOpen(true)
    }
  }, [isCalled, getCurrentUrl])

  const onOpen: ContactModalContextProps["onOpen"] = (args) => {
    const updatedMeta = {
      ...meta,
      url: getCurrentUrl(), // ensure we always store a URL when opening
      ...args?.meta,
    }
    setMeta(updatedMeta)
    setIsOpen(true)
  }

  const onClose = () => {
    // Remove the "contact" query parameter from the URL without reloading the page.
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.delete("contact")
      window.history.replaceState({}, "", url.toString())
    }
    setIsOpen(false)
  }

  const onSubmit = async (data: ContactFormValues): Promise<void> => {
    // Never empty: prefer meta.url, else current url, else "unknown"
    const invokedOnUrl = meta?.url ?? getCurrentUrl() ?? "unknown"

    const { errors } = await sendTemplateMail(
      "9c919b15-02f9-46ef-8fe8-db0b04abfc40", // replace with your actual template ID
      {
        envelope: {
          replyTo: data.email,
        },
        values: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || "",
          message: data.message,
          invokedOnUrl, // <-- full href incl. search + hash; never empty
        },
      }
    )

    if (errors) {
      toast({
        title: "Fehler",
        description: "Es ist ein Fehler aufgetreten.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } else {
      toast({
        title: "Erfolg",
        description: "Ihre Nachricht wurde erfolgreich versendet.",
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
