import type { GatsbyConfig } from 'gatsby';
import { messagesByLocale } from './src/gatsby-plugin-jaen/locales/messages'
import { SITE } from './src/vars/site-variants'

require('dotenv').config({
  path: `.env.public`
});

/**
 * .env is gitignored and this repository is public, so anything that should not
 * be readable on GitHub lives there. GATSBY_MAPBOX_TOKEN is the case in point:
 * Mapbox public tokens ship in the browser bundle by design, but an unrestricted
 * one still belongs out of the tree. dotenv does not overwrite what the
 * environment already carries, so a CI variable of the same name still wins.
 */
require('dotenv').config({
  path: `.env`
});

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: `${SITE.siteUrl}/`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  flags: {
    DEV_SSR: false
  },
  plugins: [
    {
      /**
       * The app's documents are never held anywhere but the origin.
       *
       * okf/architecture/offline.md, "The installed app never goes white
       * after a deploy". The service worker is network first on /app since
       * app 1.6.3, and that is worth nothing if the browser or the edge
       * answers the navigation out of an HTTP cache of its own: the document
       * would be yesterday's, naming chunks this deploy has taken away, and
       * the page would be white again for the same reason.
       *
       * Cloudflare Pages already answers HTML with max-age=0 and
       * must-revalidate, and the plugin already writes `no-cache` for
       * /sw.js. These three say the same thing out loud for the app, its
       * shell and app-data.json, the file that carries the build's
       * compilation hash and is how Gatsby notices there is a new build at
       * all. Everything else keeps the plugin's headers, the immutable year
       * on /static/* included.
       */
      resolve: `gatsby-plugin-cloudflare-pages`,
      options: {
        headers: {
          '/app/*': ['Cache-Control: no-cache'],
          '/offline-plugin-app-shell-fallback/*': ['Cache-Control: no-cache'],
          '/app-data.json': ['Cache-Control: no-cache']
        }
      }
    },
    {
      resolve: `gatsby-plugin-jaen`,
      options: {
        pylonUrl: 'https://services.netsnek.com/jaen/graphql',
        /**
         * The jaen agent, the one service that holds the shared draft. Every
         * change an editor makes is committed to this repository by the agent
         * as it happens and every other open CMS takes the new head from a
         * poll, so a colleague sees a draft, and a picture uploaded on a
         * phone, without a publish and without a build.
         *
         * `site` is this site's key in the agent's SITES table, which names
         * the repository. It is not derived from the audience: limosen.at and
         * booklimo.at sign in against the same Zitadel project and client, so
         * their audience is identical, and it is the organisation behind the
         * caller's `jaen:admin` that decides which of the two they may write.
         *
         * One Worker answers both sites, under one custom domain per site:
         * `agent.jaen.netsnek.com` cannot be it, because a Worker custom
         * domain needs its zone in the Worker's own Cloudflare account and
         * netsnek.com is a zone of another one.
         *
         * JAEN_AGENT_URL points a local production build at a wrangler dev of
         * the agent. See jaen/docs/architecture/draft-state.md.
         */
        agent: {
          url:
            process.env.JAEN_AGENT_URL ||
            'https://jaen-agent.limosen.at/graphql',
          site: SITE.repository.split('/')[1],
          // The poll is the tail of the ten second acceptance: the saved
          // change is already committed by the time it runs, so the interval
          // only decides how long the other editor's CMS waits before it asks.
          // A poll whose sinceSha is still the head answers `changed: false`
          // with no body out of the agent's KV, so a short interval costs the
          // agent almost nothing.
          //
          // Measured with two editors on booklimo.at against the live agent.
          // At one flat 2500: a text change reached the second editor in
          // 9.3 s and a picture in 9.3 s. With the split below, and with the
          // picture and the settled text field no longer waiting out the save
          // debounce: 6.9 s and 7.3 s. See
          // jaen/docs/architecture/draft-state.md, "The budget".
          pollMs: 5000,
          activePollMs: 1500
        },
        remote: {
          repository: SITE.repository
        },
        siteUrl: SITE.siteUrl,
        // Renamed from `zitadel` on the jaen branch this site now links against.
        // Same identity server, but jaen reads roles and the profile through
        // zitadel-gql's GraphQL surface instead of REST. The ids are unchanged,
        // so the CMS keeps talking to the same tenant and project.
        zitadelGql: {
          organizationId: SITE.organizationId,
          clientId: '268283382465631862@cms',
          authority: 'https://accounts.netsnek.com',
          redirectUri:
            process.env.NODE_ENV === 'production'
              ? SITE.redirectUri
              : 'http://localhost:8000',
          projectIds: ['268283277977065078']
        },
        /**
         * SENTRY_OFF=1 leaves this block out, and jaen then disables the plugin
         * entirely rather than half-configuring it.
         *
         * It exists because a build cannot always create a Sentry release.
         * gatsby-plugin-jaen writes SENTRY_ORG, SENTRY_PROJECT and SENTRY_URL
         * into the environment from the values below, and it derives SENTRY_URL
         * from the DSN's origin, which is the ingest host and not the API host.
         * @sentry/cli therefore asks the wrong server for the project and the
         * whole bundle step fails with "project not found". A verification build
         * has no use for a release anyway, and the runtime DSN is unaffected.
         */
        ...(process.env.SENTRY_OFF
          ? {}
          : {
              sentry: {
                org: 'netsnek',
                project: 'limosen-at',
                dsn: 'https://05b95fec2b635a71f00d5740c8240865@o4510394429079552.ingest.de.sentry.io/4510432642138192'
              }
            }),
        googleAnalytics: {
          trackingIds: ['G-X2816CKYFM']
        },
        /**
         * The CMS and the app land dark. The public pages have no colour
         * mode, the plugin forces them light. The palette dark resolves to
         * is this site's, defined as the _dark halves in
         * src/styles/theme/system.ts, so the app and the CMS inside jaen's
         * frame take the brand's charcoal and gold from here rather than
         * jaen's grey. See okf/decisions/hard-rules.md.
         */
        colorMode: {default: 'dark'}
      }
    },
    {
      resolve: 'gatsby-plugin-i18n-l10n',
      options: {
        siteUrl: `${SITE.siteUrl}/`,
        defaultLocale: 'en-US',
        locales: [
          {
            locale: 'en-US',
            prefix: 'en',
            messages: messagesByLocale['en-US'], // <-- plain object from TS
            slugs: {}
          },
          {
            locale: 'de-AT',
            prefix: 'de',
            messages: messagesByLocale['de-AT'],
            slugs: {}
          },
          {
            locale: 'tr-TR',
            prefix: 'tr',
            messages: messagesByLocale['tr-TR'],
            slugs: {}
          },
          {
            locale: 'ar-EG',
            prefix: 'ar',
            messages: messagesByLocale['ar-EG'],
            slugs: {}
          }
        ],
        trailingSlash: 'always'
      }
    },
    //`gatsby-jaen-lens`
    /**
     * The app area, /app/booking, /app/transfers, /app/users, /app/locations,
     * /app/dashboard and the two detail routes, against the pylon at
     * api.limosen.at.
     *
     * It sits BEFORE the manifest block on purpose. A plugin's own config is
     * merged with the site's and every gatsby-plugin-manifest instance writes the
     * same public/manifest.webmanifest, so whichever runs last wins. The site's
     * KRCLimo manifest has to be the last one.
     */
    {
      resolve: `gatsby-jaen-app`,
      options: {
        pylonUrl: SITE.appPylonUrl,
        // The project role that marks somebody as a driver. The dispatch
        // screen's driver picker filters by it, because offering every account
        // there put customers and hotel front desks in a driver dropdown.
        driverRoleKey: 'limosen:driver',
        customerRoleKey: 'limosen:customer'
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `KRCLimo App`,
        short_name: `KRCLimo`,
        start_url: `/login`,
        background_color: `#ffffff`,
        theme_color: `#ffffff`,
        display: `standalone`,
        icon: SITE.icon
      }
    },
    {
      // gatsby-jaen-mailpress became gatsby-jaen-emailwerk, emailwerk being
      // mailpress v3. The CMS routes move with it, from /mailpress/* to
      // /emailwerk/*, and the option is `url` rather than `pylonUrl`.
      resolve: `gatsby-jaen-emailwerk`,
      options: {
        url: 'https://emailwerk.com/graphql'
      }
    },
  ]
};

export default config;
