import React, { useState } from 'react';
import styled from '@emotion/styled';
import type { ReactElement } from 'react';
import Button from '../components/shared/Button';
import ClaimRewardsModal from '../components/ClaimRewards/ClaimRewardsModal';
import GiveRewardsModal from '../components/GiveRewards/GiveRewardsModal';
import Layout from '../components/shared/Layout';
import TopBar from '../components/shared/Topbar';
import { Web3Provider } from '@ethersproject/providers';
import { useContracts } from '../shared/contexts';
import EndorsementModal from '../components/Endorsement/EndorsementPage';
import { Body1, Heading1 } from '../shared/style/theme';
import { Divider } from '../components/shared/Divider';
import { useWeb3React } from '@web3-react/core';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Background = (): JSX.Element => {
  return (
    <BackgroundWrapper>
      <BackgroundGrid />
    </BackgroundWrapper>
  );
};

const Footer = styled.div`
  width: 100%;
  height: 160px;
  background-image: url('/StationFloor.png');
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  left: 0;
  bottom: 0;
  padding: 10px;

  @media (max-width: 760px) {
    justify-content: center;
  }
`;

const FooterStatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: Resistance;
  font-size: 48px;
  color: ${(props) => props.theme.colors.white};
`;

const FooterStatDescription = styled.p`
  font-size: 20px;
  margin: 0px;
`;

const FooterStatValue = styled.p`
  margin: 0px;
`;

const FooterStat = ({
  description,
  value,
}: {
  description: string;
  value: string;
}): JSX.Element => {
  return (
    <FooterStatWrapper>
      <FooterStatValue>{value}</FooterStatValue>
      <FooterStatDescription>{description}</FooterStatDescription>
    </FooterStatWrapper>
  );
};

const FooterStats = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  @media (max-width: 760px) {
    display: none;
  }
`;

const FooterActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: 10px;
  align-items: center;
  margin-right: 20px;
`;

const FooterActionButton = styled(Button)`
  width: 205px;
`;

const TitleWrapper = styled.div`
  margin: 50px 0px;
  width: 401px;
  height: 123px;
  padding: 4px;
  background-color: ${(props) => props.theme.colors.black};
  @media (max-height: 830px) {
    width: 200px;
    height: 61px;
    margin: 30px 0px;
  }
`;

const TitleBorderInset = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid ${(props) => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled.h1`
  font-family: Resistance;
  color: ${(props) => props.theme.colors.white};
  margin: 0px;
  font-size: 80px;
  @media (max-height: 830px) {
    font-size: 40px;
  }
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
  @media (max-width: 760px) {
    flex-direction: column-reverse;
    align-items: center;
    padding: 10px;
  }
`;

const ContributorsListWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  height: 461px;
  max-width: 408px;
  overflow: scroll;
`;

const ContributorsDirectoryContentContainer = styled.div`
  padding: 18px;
`;

const AliasesWrapper = styled.div`
  margin-top: 20px;
  column-count: 2;
`;

const Alias = styled.div`
  margin-bottom: 10px;
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
      <ContributorsDirectoryContentContainer>
        <Heading1>CONTRIBUTOR DIRECTORY</Heading1>
        <AliasesWrapper>
          {aliases.map((alias, i) => (
            <Alias key={'alias' + i}>
              <Body1> {alias}</Body1>
            </Alias>
          ))}
        </AliasesWrapper>
      </ContributorsDirectoryContentContainer>
    </ContributorsListWrapper>
  );
};

const DAOSummaryWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.black};
  color: ${(props) => props.theme.colors.white};
  margin: 50px 10px 0px 0px;
  height: 347px;
  width: 355px;
`;

const DAOSummaryHeaderContainer = styled.div`
  padding: 20px;
`;

const DaoSummaryContibutionsWrapper = styled.div`
  margin-bottom: 16px;
`;

const DaoSummaryToken = styled.span`
  color: ${(props) => props.theme.colors.gray};
`;

const DaoSummaryTextWrapper = styled.div`
  margin: 20px 20px 16px 16px;
`;

const DocsLinkWrapper = styled.a`
  display: flex;
  flex-direction: row;
`;

const DocsLinkArrowIcon = styled.img`
  margin-right: 10px;
`;

const DocsLinkText = styled.p`
  color: ${(props) => props.theme.colors.green};
  font-size: 14px;
  font-family: Favorit Pro;
  margin: 0px;
`;

const DAOInfoRowContainer = styled.div`
  padding: 2px 0px;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const DAODescriptionContainer = styled.div`
  margin-bottom: 20px;
`;

const DocsLink = ({
  linkTitle,
  url,
}: {
  linkTitle: string;
  url: string;
}): JSX.Element => (
  <DocsLinkWrapper href={url} target="_blank">
    <DocsLinkArrowIcon src={'/Arrow.svg'} alt={'arrow icon'} />
    <DocsLinkText>
      <Body1>{linkTitle}</Body1>
    </DocsLinkText>
  </DocsLinkWrapper>
);

const DAOSummary = (): JSX.Element => {
  const week = 1;
  const contributorCount = 25;
  const contributorBudget = 400000;
  const token = '$DEF';

  return (
    <DAOSummaryWrapper>
      <DAOSummaryHeaderContainer>
        <DaoSummaryContibutionsWrapper>
          <Heading1>WEEK {week}</Heading1>
        </DaoSummaryContibutionsWrapper>

        <DAOInfoRowContainer>
          <Body1>Contributors</Body1>
          <Body1>{contributorCount}</Body1>
        </DAOInfoRowContainer>

        <DAOInfoRowContainer>
          <Body1>Contributor Budget</Body1>
          <Body1>
            {contributorBudget} <DaoSummaryToken>{token}</DaoSummaryToken>
          </Body1>
        </DAOInfoRowContainer>
      </DAOSummaryHeaderContainer>

      <Divider />

      <DaoSummaryTextWrapper>
        <DAODescriptionContainer>
          <Body1>
            Default creates building blocks for governance, payments, and
            peer-to-peer coordination mechanisms that align incentives across
            organizational stakeholders and optimize for fairness and
            meritocracy.
          </Body1>
        </DAODescriptionContainer>
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
  const contract = useContracts();
  const { account } = useWeb3React<Web3Provider>();

  const [isClaimRewardsModalOpen, setIsClaimRewardsModalOpen] =
    useState<boolean>(false);
  const [isGiveRewardsModalOpen, setIsGiveRewardsModalOpen] =
    useState<boolean>(false);
  const [isEndorsementOpen, setIsEndorsementOpen] = useState<boolean>(true);

  const handleCloseClaimRewardsModal = () => {
    setIsClaimRewardsModalOpen(false);
  };
  const handleCloseGiveRewardsModal = () => {
    setIsGiveRewardsModalOpen(false);
  };

  const handleCloseEndorsement = (): void => {
    setIsEndorsementOpen(false);
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
      </PageWrapper>
      <Footer>
        <FooterStats>
          <FooterStat description={'YOUR TOTAL $DEF'} value={'44,000'} />
          <FooterStat description={'YOUR OWNERSHIP'} value={'3%'} />
          <FooterStat
            description={'TOTAL ENDORSEMENTS RECEIVED'}
            value={'1,235'}
          />
        </FooterStats>
        <FooterActions>
          <FooterActionButton
            onClick={() => {
              setIsGiveRewardsModalOpen(true);
            }}
          >
            REWARD
          </FooterActionButton>
          <FooterActionButton
            onClick={() => {
              setIsEndorsementOpen(true);
            }}
          >
            ENDORSE
          </FooterActionButton>
          <FooterActionButton
            onClick={() => {
              setIsClaimRewardsModalOpen(true);
            }}
          >
            CLAIM REWARDS
          </FooterActionButton>
        </FooterActions>
      </Footer>

      <ClaimRewardsModal
        isOpen={isClaimRewardsModalOpen}
        onRequestClose={handleCloseClaimRewardsModal}
      />
      <GiveRewardsModal
        isOpen={isGiveRewardsModalOpen}
        onRequestClose={handleCloseGiveRewardsModal}
      />

      <EndorsementModal
        isOpen={isEndorsementOpen}
        onRequestClose={handleCloseEndorsement}
      />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
