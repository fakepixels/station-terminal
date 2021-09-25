import styled from '@emotion/styled';
import * as React from 'react';
import type { ReactElement } from 'react';

import ContributionModal from '../components/Contributions/ContributionsModal';
import Layout from '../components/shared/Layout';
import TopBar from '../components/shared/TopBar';

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

const BackgroundGrid = styled.div`
  height: 100%;
  width: 100%;
  background-image: url('/Grid.svg');
`;

const Background = () => {
  return (
    <BackgroundWrapper>
      <BackgroundGrid></BackgroundGrid>
    </BackgroundWrapper>
  );
};

const FooterWrapper = styled.div`
  width: 100%;
  height: 226px;
  background-image: url('/StationFloor.png');
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  left: 0;
  bottom: 0;
`;

const FooterStat = (): JSX.Element => {
  return <div>Stat</div>;
};

const FooterStats = (): JSX.Element => {
  return (
    <div>
      <FooterStat />
      <FooterStat />
      <FooterStat />
    </div>
  );
};

const FooterActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterActions = (): JSX.Element => {
  return (
    <FooterActionsWrapper>
      <div>Action 1</div>
      <div>Action 2</div>
      <div>Action 3</div>
    </FooterActionsWrapper>
  );
};

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterStats />
      <FooterActions />
    </FooterWrapper>
  );
};

const TitleWrapper = styled.div`
  margin: 90px 0px 50px 0px;
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
  font-family: Resistance;
  font-size: 80px;
  color: #f2efef;
`;

const Title = ({ daoName }: { daoName: string }): JSX.Element => (
  <TitleWrapper>
    <TitleBorderInset>
      <TitleText>{daoName.toUpperCase()}</TitleText>
    </TitleBorderInset>
  </TitleWrapper>
);

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: space-around;
  width: 100%;
`;

const ContributorsListWrapper = styled.div`
  background-color: #feecde;
  height: 461px;
  width: 408px;
  margin-left: 10px;
  overflow: scroll;
`;

const ContributorsListTitle = styled.h2`
  margin: 20px;
  font-family: Terminal;
  font-size: 30px;
`;

const AliasesWrapper = styled.div`
  column-count: 2;
  margin: 0px 20px;
`;

const Alias = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  font-family: Favorit Pro;
`;

const ContributorsList = (): JSX.Element => {
  const aliases = [
    '@mindapi',
    '@fakepixels',
    '@zaz',
    '@scottsgc',
    '@fullyallocated',
    '@tsully',
    '@mindapi',
    '@fakepixels',
    '@zaz',
    '@scottsgc',
    '@fullyallocated',
    '@tsully',
    '@mindapi',
    '@fakepixels',
    '@zaz',
    '@scottsgc',
    '@fullyallocated',
    '@tsully',
    '@mindapi',
    '@fakepixels',
    '@zaz',
    '@scottsgc',
    '@fullyallocated',
    '@tsully',
  ];

  return (
    <ContributorsListWrapper>
      <TopBar mandatory={false} />
      <ContributorsListTitle>CONTRIBUTOR DIRECTORY</ContributorsListTitle>
      <AliasesWrapper>
        {aliases.map((alias, i) => (
          <Alias key={'alias' + i}>{alias}</Alias>
        ))}
      </AliasesWrapper>
    </ContributorsListWrapper>
  );
};

const DAOSummaryWrapper = styled.div`
  background-color: #090909;
  margin: 50px 10px 0px 0px;
  height: 347px;
  width: 355px;
`;

const DaoSummaryContibutionsWrapper = styled.div``;

const DaoSummaryContibutionsTitle = styled.div`
  font-family: Terminal;
  font-size: 30px;
  color: #f2efef;
  margin: 20px 16px 0px;
`;

const DaoSummaryContibutionsGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: 20px 20px;
  color: #f2efef;
  margin: 12px 16px 20px;
`;

const DaoSummaryLabel = styled.p`
  color: #f2efef;
  font-size: 14px;
  font-family: Favorit Pro;
`;

const DaoSummaryValue = styled.p`
  text-align: right;
  color: #f2efef;
  font-size: 14px;
  font-family: Favorit Pro;
`;

const DaoSummaryToken = styled.span`
  color: #626262;
`;

const DaoSummaryDivider = styled.div`
  border-bottom: 1px solid #626262;
  width: 100%;
`;

const DaoSummaryTextWrapper = styled.div`
  margin: 20px 20px 16px 16px;
`;

const DAOSummaryText = styled.p`
  color: #f2efef;
  font-size: 14px;
  font-family: Favorit Pro;
`;

const DocsLinkWrapper = styled.a`
  display: flex;
  flex-direction: row;
`;

const DocsLinkArrowIcon = styled.img`
  margin-right: 10px;
`;

const DocsLinkText = styled.p`
  color: #85d59a;
  font-size: 14px;
  font-family: Favorit Pro;
  margin: 0px;
`;

const DocsLink = ({
  linkTitle,
  url,
}: {
  linkTitle: string;
  url: string;
}): JSX.Element => {
  return (
    <DocsLinkWrapper href={url} target="_blank">
      <DocsLinkArrowIcon src={'/Arrow.svg'} alt={'arrow icon'} />
      <DocsLinkText>{linkTitle}</DocsLinkText>
    </DocsLinkWrapper>
  );
};

const DAOSummary = (): JSX.Element => {
  const week = 1;
  const contributorCount = 25;
  const contributorBudget = 400000;
  const token = '$DEF';

  return (
    <DAOSummaryWrapper>
      <DaoSummaryContibutionsWrapper>
        <DaoSummaryContibutionsTitle>WEEK {week}</DaoSummaryContibutionsTitle>
      </DaoSummaryContibutionsWrapper>
      <DaoSummaryContibutionsGrid>
        <DaoSummaryLabel>Contributors</DaoSummaryLabel>
        <DaoSummaryValue>{contributorCount}</DaoSummaryValue>
        <DaoSummaryLabel>Contributor budget</DaoSummaryLabel>
        <DaoSummaryValue>
          {contributorBudget} <DaoSummaryToken>{token}</DaoSummaryToken>
        </DaoSummaryValue>
      </DaoSummaryContibutionsGrid>
      <DaoSummaryDivider />
      <DaoSummaryTextWrapper>
        <DAOSummaryText>
          Default creates building blocks for governance, payments, and
          peer-to-peer coordination mechanisms that align incentives across
          organizational stakeholders and optimize for fairness and meritocracy.
        </DAOSummaryText>
        <DocsLink linkTitle={'Contributor Directory'} url={'/'} />
        <DocsLink linkTitle={'Docs'} url={'/'} />
        <DocsLink linkTitle={'Discord'} url={'/'} />
        <DocsLink linkTitle={'Twitter'} url={'/'} />
        <DocsLink linkTitle={'Github'} url={'/'} />
      </DaoSummaryTextWrapper>
    </DAOSummaryWrapper>
  );
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
      <PageWrapper>
        <Title daoName={'Default'} />
        <ContentWrapper>
          <ContributorsList />
          <DAOSummary />
        </ContentWrapper>
        {/* <div>
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
        </div> */}
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
