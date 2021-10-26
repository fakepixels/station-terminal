import { ApolloClient, InMemoryCache } from '@apollo/client';

console.log('EN: ', process.env.SUBGRAPH_URI);

export const client = new ApolloClient({
  // Replace with environment variable
  uri: process.env.SUBGRAPH_URI,
  cache: new InMemoryCache(),
});
