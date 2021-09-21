import styled from '@emotion/styled';
import * as React from 'react';
import { useAccount, useContract } from '../shared/contexts';

const Title = styled.h1`
  color: purple;
`;

export const Home = (): JSX.Element => {
  const contract = useContract();
  const account = useAccount();

  console.log('contract is ', contract);
  console.log('account is ', account);

  return <Title>Station terminal</Title>;
};

export default Home;
