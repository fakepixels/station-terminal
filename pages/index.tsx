import styled from '@emotion/styled';
import * as React from 'react';
import type { ReactElement } from 'react';
import ContributionModal from '../components/Contributions/ContributionsModal';
import Layout from '../components/shared/Layout';

import { useAccount, useContract } from '../shared/contexts';

const Title = styled.h1`
  color: purple;
`;

const ContributionModalButton = styled.button`
  background-color: #85d59a;
`;

const Home = (): JSX.Element => {
  const contract = useContract();
  const account = useAccount();

  const [isOpen, setIsOpen] = React.useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };

  console.log('contract is ', contract);
  console.log('account is ', account);

  return (
    <>
      <Title>Station terminal</Title>
      <ContributionModalButton
        onClick={() => {
          setIsOpen(false);
        }}
      >
        Contributions
      </ContributionModalButton>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <ContributionModal isOpen={isOpen} onRequestClose={handleClose}>
        <p>This is the contribution modal</p>
      </ContributionModal>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
