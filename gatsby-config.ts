import type { GatsbyConfig } from 'gatsby';
import { messagesByLocale } from './src/gatsby-plugin-jaen/locales/messages'

require('dotenv').config({
  path: `.env.public`
});

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: `https://limosen.at/`
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
          repository: 'netsnek/limosen.at'
        },
        siteUrl: 'https://limosen.at',
        // Renamed from `zitadel` on the jaen branch this site now links against.
        // Same identity server, but jaen reads roles and the profile through
        // zitadel-gql's GraphQL surface instead of REST. The ids are unchanged,
        // so the CMS keeps talking to the same tenant and project.
        zitadelGql: {
          organizationId: '339284789469124181',
          clientId: '268283382465631862@cms',
          authority: 'https://accounts.netsnek.com',
          redirectUri:
            process.env.NODE_ENV === 'production'
              ? 'https://limosen.at/loading'
              : 'http://localhost:8000',
          projectIds: ['268283277977065078']
        },
        sentry: {
          org: 'netsnek',
          project: 'limosen-at',
          dsn: 'https://05b95fec2b635a71f00d5740c8240865@o4510394429079552.ingest.de.sentry.io/4510432642138192'
        },
        googleAnalytics: {
          trackingIds: ['G-X2816CKYFM']
        }
      }
    },
    {
      resolve: 'gatsby-plugin-i18n-l10n',
      options: {
        siteUrl: 'https://limosen.at/',
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
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `KRCLimo App`,
        short_name: `KRCLimo`,
        start_url: `/login`,
        background_color: `#ffffff`,
        theme_color: `#ffffff`,
        display: `standalone`,
        icon: `src/favicon.ico`
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
    // gatsby-jaen-app, which serves /app/* against api.limosen.at, has no home
    // on the jaen branch this site now links against: the package exists only on
    // the abandoned netsnek/i18n branch, not on dev and not on feat/chakra-v3.
    // Left out of this build on purpose so the public site can be verified
    // first. Restoring the app area is its own piece of work and the options are
    // recorded in the migration notes.
    // {
    //   resolve: `gatsby-jaen-app`,
    //   options: {
    //     pylonUrl: 'https://api.limosen.at/graphql'
    //   }
    // },
  ]
};

export default config;
