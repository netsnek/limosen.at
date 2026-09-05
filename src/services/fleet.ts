import {useEffect, useState} from 'react'

import {SITE} from '../vars/site-variants'

export interface FleetClass {
  carClass: string
  models: string[]
  count: number
}

/**
 * The fleet as the company actually operates it, read from its own backend.
 *
 * The booking form used to offer whatever the translations listed, which meant
 * the vehicle list was maintained by hand in four languages and drifted from
 * the cars in the fleet. `fleet` is a public query on purpose: it carries the
 * classes and the models and neither a licence plate nor the driver a car is
 * assigned to, so an anonymous form may read it while `cars` stays behind
 * authentication.
 *
 * A failure is not an error the visitor should see. The caller keeps the
 * translated list as its fallback, so an unreachable backend costs the accuracy
 * of the list and nothing else. The same goes for an empty answer: this brand's
 * Car table holds no rows yet, and `[]` must leave the visitor with the
 * translated classes rather than with a form that offers nothing.
 */
export const useFleet = () => {
  const [fleet, setFleet] = useState<FleetClass[] | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch(SITE.appPylonUrl, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            query: '{ fleet { carClass models count } }'
          })
        })

        const payload = await response.json()

        if (!cancelled && Array.isArray(payload?.data?.fleet)) {
          setFleet(payload.data.fleet)
        }
      } catch {
        // Keep the fallback.
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  return fleet
}
