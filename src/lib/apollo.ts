import { ApolloClient, InMemoryCache } from "@apollo/client";

const CONTENT_API_TOKEN = process.env.CONTENT_API_TOKEN;

export const apolloClient = new ApolloClient({
  uri: process.env.CONTENT_API,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${CONTENT_API_TOKEN}`,
  },
});
