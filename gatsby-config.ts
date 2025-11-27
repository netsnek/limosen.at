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
        zitadel: {
          organizationId: '339284789469124181',
          clientId: '268283382465631862@cms',
          authority: 'https://accounts.netsnek.com',
          redirectUri:
            process.env.NODE_ENV === 'production'
              ? 'https://limosen.at/loading'
              : 'https://psychic-dollop-6vwv6x9vq9jf464g-8000.app.github.dev',
          projectIds: ['2268283277977065078']
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
        name: `Limosen App`,
        short_name: `Limosen`,
        start_url: `/login`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`,
        icon: `src/favicon.ico`
      }
    },
    {
      resolve: `gatsby-jaen-mailpress`,
      options: {
        pylonUrl: 'https://mailpress.netsnek.com/graphql'
      }
    },
    {
      resolve: `gatsby-jaen-app`,
      options: {
        pylonUrl: 'https://limosen.netsnek.workers.dev/graphql'
      }
    },
  ]
};

export default config;
