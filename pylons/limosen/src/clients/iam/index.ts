/**
 * GQty: You can safely modify this file based on your needs.
 */

import {
  Cache,
  createClient,
  defaultResponseHandler,
  GQtyError,
  type QueryFetcher,
} from 'pgqty';
import {
  generatedSchema,
  scalarsEnumsHash,
  type GeneratedSchema,
} from './schema.generated';
import { GraphQLError } from 'graphql';
import { getContext } from '@getcronit/pylon';

const queryFetcher: QueryFetcher = async function (
  { query, variables, operationName, extensions },
  fetchOptions
) {
  const apiURL = (extensions?.env as any).IAM_API_URL;

  const context = getContext();

  console.log(context.get('graphqlResolveInfo')?.path)

  if (!apiURL) {
    // Modify in wrangler.toml or create a .env file
    throw new GraphQLError('apiURL is required');
  }
  
  let data;

  try {
    // Modify "https://iam.netsnek.workers.dev/graphql" if needed
    const response = await fetch(apiURL, {
      method: 'POST',
      headers: {
        'Authorization': extensions?.authToken as string,	
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
        operationName,
      }),
      ...fetchOptions,
    });

    data = await defaultResponseHandler(response);
  }
  catch (error: any) {
    if (error instanceof GQtyError) {
      if ( error.graphQLErrors?.[0]){
        console.log("error.graphQLErrors[0].message: ", error.graphQLErrors[0] instanceof GraphQLError);
        throw new GraphQLError(error.graphQLErrors[0].message, {
          extensions: error.graphQLErrors[0].extensions,
          //path: error.graphQLErrors[0].path,
        });
        //throw error.graphQLErrors[0]
      }

      throw new GraphQLError("Why not here: " + error?.message);
    }

    throw new GraphQLError("Why here: " + error?.message);
  }

  return data;
};

const cache = new Cache(
  undefined,
  /**
   * Default option is immediate cache expiry but keep it for 5 minutes,
   * allowing soft refetches in background.
   */
  {
    maxAge: 0,
    staleWhileRevalidate: 5 * 60 * 1000,
    normalization: true,
  }
);

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
  },
});

// Core functions
export const { resolve, subscribe, schema } = client;

// Legacy functions
export const {
  query,
  mutation,
  mutate,
  subscription,
  resolved,
  refetch,
  track,
} = client;

export * from './schema.generated';
