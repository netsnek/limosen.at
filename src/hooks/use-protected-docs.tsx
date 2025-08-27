import { useEffect, useState } from 'react'
import { navigate } from 'gatsby'
import { useAuth, checkUserRoles } from 'jaen'
import { useToast, Spinner, Center } from '@chakra-ui/react'

/**
 * Protect /docs/magisterarbeit/* for jaen:admin users only.
 * Blocks rendering until check is done.
 */
export const useProtectedDocs = () => {
  const auth = useAuth()
  const { signinRedirect } = auth
  const toast = useToast()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const path = window.location.pathname

    if (path.startsWith('/docs/magisterarbeit')) {
      if (!auth.isAuthenticated) {
        signinRedirect()
        return
      }

      const isAdmin = checkUserRoles(auth.user, ['jaen:admin'])

      if (!isAdmin) {
        toast({
          title: 'Zugriff verweigert',
          description: 'Sie haben keine Berechtigung, diese Seite zu sehen.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        void navigate('/')
        return
      }
    }

    setIsChecking(false)
  }, [auth.isAuthenticated, auth.user, signinRedirect, toast])

  return { isChecking }
}
