import styled from '@emotion/styled';
import * as React from 'react';
import type { ReactElement } from 'react';
import ContributionModal from '../components/Contributions/ContributionsModal';
import Layout from '../components/shared/Layout';

import { useAccount, useContract } from '../shared/contexts';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background: linear-gradient(#ffffff, #ff816e);
`;

const Background = () => {
  return <BackgroundWrapper></BackgroundWrapper>;
};

const FooterWrapper = styled.div`
  width: 100%;
  height: 226px;
  background-image: url('/StationFloor.png');
  position: fixed;
  left: 0;
  bottom: 0;
`;

const Footer = () => {
  return <FooterWrapper></FooterWrapper>;
};

const TitleWrapper = styled.div`
  margin: 90px 0px 30px 0px;
  width: 401px;
  height: 123px;
  padding: 4px;
  background-color: #090909;
`;

const TitleBorderInset = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid #f2efef;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.h1`
  color: #f2efef;
`;

const Title = ({ daoName }: { daoName: string }): JSX.Element => (
  <TitleWrapper>
    <TitleBorderInset>
      <TitleText>{daoName}</TitleText>
    </TitleBorderInset>
  </TitleWrapper>
);

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
      <PageWrapper>
        <Title daoName={'Default'} />
        <div>
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
        </div>
      </PageWrapper>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
      <Footer></Footer>
    </Layout>
  );
};

export default Home;
