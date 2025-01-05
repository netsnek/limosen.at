import type { GatsbyConfig } from 'gatsby';

require('dotenv').config({
  path: `.env.public`
});

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: `https://barbara-mauz.at/`
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
          repository: 'netsnek/lycheeprincess'
        },
        zitadel: {
          organizationId: '278641258304378483',
          clientId: '278642690558596723@barbara-mauz',
          authority: 'https://accounts.netsnek.com',
          redirectUri:
            process.env.NODE_ENV === 'production'
              ? 'https://barbara-mauz.at'
              : 'https://psychic-dollop-6vwv6x9vq9jf464g-8000.app.github.dev',
          projectIds: ['263491274097563233']
        },
        // sentry: {
        //   org: 'photonq',
        //   project: 'website',
        //   dsn: 'https://37ffbc7589f79cfab5936ce5fca4f310@sentry.cronit.io/10'
        // },
        googleAnalytics: {
          trackingIds: ['G-M58K75M9PG']
        }
      }
    },
    {
      resolve: `gatsby-jaen-mailpress`,
      options: {
        pylonUrl: 'https://mailpress.netsnek.com/graphql'
      }
    },
    //`gatsby-jaen-lens`
  ]
};

export default config;
