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
    `gatsby-plugin-cloudflare-pages`,
    {
      resolve: `gatsby-plugin-jaen`,
      options: {
        pylonUrl: 'https://services.netsnek.com/jaen/graphql',
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
