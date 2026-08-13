import { useEffect, useState } from 'react'
import { navigate } from 'gatsby'
import { useAuth, useNotificationsContext /*, checkUserRoles*/ } from 'jaen'

/**
 * Protect /docs/magisterarbeit/* for authenticated users only.
 * Blocks rendering until check is done.
 */
export const useProtectedDocs = () => {
  const auth = useAuth()
  // v3 dropped useToast for a store whose create() reads `type`, not `status`.
  // jaen's notifications context wraps that store back up in v2's option shape,
  // so the call below keeps the placement, timing and close button it had.
  const { toast } = useNotificationsContext()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const path = window.location.pathname

    if (path.startsWith('/docs/magisterarbeit')) {
      if (!auth.isAuthenticated) {
        toast({
          title: 'Nicht eingeloggt',
          description: 'Bitte melden Sie sich an, um diese Seite zu sehen.',
          status: 'error',
          duration: 5000,
          isClosable: true
        })

        void navigate('/login')
        return
      }

      // 🔒 later: role check
      /*
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
      */
    }

    setIsChecking(false)
  }, [auth.isAuthenticated, auth.user, toast])

  return { isChecking }
}
