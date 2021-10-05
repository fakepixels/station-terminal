import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  // Replace with environment variable
  uri: 'http://127.0.0.1:8000/subgraphs/name/zaqk/default-subgraph',
  cache: new InMemoryCache(),
});
