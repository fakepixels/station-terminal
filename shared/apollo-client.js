import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  // TODO: url of subgraph
  uri: 'example.com',
  cache: new InMemoryCache(),
});

export default client;
