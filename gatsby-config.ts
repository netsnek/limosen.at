import type { GatsbyConfig } from 'gatsby';

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
          repository: 'netsnek/nadine-hauswirth'
        },
        zitadel: {
          organizationId: '339284789469124181',
          clientId: '268283382465631862@cms',
          authority: 'https://accounts.netsnek.com',
          redirectUri:
            process.env.NODE_ENV === 'production'
              ? 'https://nadine-hauswirth.com'
              : 'https://psychic-dollop-6vwv6x9vq9jf464g-8000.app.github.dev',
          projectIds: [
            '2268283277977065078'
          ]
        },
        // sentry: {
        //   org: 'photonq',
        //   project: 'website',
        //   dsn: 'https://37ffbc7589f79cfab5936ce5fca4f310@sentry.cronit.io/10'
        // },
        googleAnalytics: {
          trackingIds: ['G-4B98VFJE2T']
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
