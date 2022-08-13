import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: process.env.CONTENT_API,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${process.env.CONTENT_API_TOKEN}`,
  },
});
