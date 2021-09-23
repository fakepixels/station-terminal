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

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0px;
  z-index: -1;
  height: 100%;
  width: 100%;
  min-width: 100px;
  min-height: 400px;
  background: linear-gradient(#ffffff, #ff816e);
`;

const Background = () => {
  return <BackgroundWrapper></BackgroundWrapper>;
};

const Home = (): JSX.Element => {
  const contract = useContract();
  const account = useAccount();

  const [isOpen, setIsOpen] = React.useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  console.log('contract is ', contract);
  console.log('account is ', account);

  return (
    <>
      <Background />
      <Title>Station terminal</Title>
      <ContributionModalButton
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Contributions
      </ContributionModalButton>

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
