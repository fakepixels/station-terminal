import styled from '@emotion/styled';
import * as React from 'react';
import type { ReactElement } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useWeb3, useContracts } from '../../shared/contexts';

import ContributorsList from '../../components/ContributorsList';
import OrgSummary from '../../components/OrgSummary';
import Button from '../../components/shared/Button';
import ContributionModal from '../../components/Contributions/ContributionsModal';
import ClaimRewardsModal from '../../components/ClaimRewards/ClaimRewardsModal';
import GiveRewardsModal from '../../components/GiveRewards/GiveRewardsModal';
import Layout from '../../components/shared/Layout';

import defaultOSFactoryABI from '../../utils/abi/DefaultOSFactory.json';
import defaultOSABI from '../../utils/abi/DefaultOS.json';
import epochABI from '../../utils/abi/Epoch.json';
import membersABI from '../../utils/abi/Members.json';
import peerRewardsABI from '../../utils/abi/PeerRewards.json';
import tokenABI from '../../utils/abi/Token.json';

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

const Background = () => {
  return (
    <BackgroundWrapper>
      <BackgroundGrid></BackgroundGrid>
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

const FooterActionButton = styled(Button)``;

const TitleWrapper = styled.div`
  margin: 50px 0px;
  min-width: 401px;
  height: 123px;
  padding: 4px;
  background-color: ${(props) => props.theme.colors.black};
  @media (max-height: 830px) {
    min-width: 200px;
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

const Title = ({ daoName }: { daoName: string }): JSX.Element => {
  return (
    <TitleWrapper>
      <TitleBorderInset>
        <TitleText>{daoName.toUpperCase()}</TitleText>
      </TitleBorderInset>
    </TitleWrapper>
  );
};

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

const Home = (): JSX.Element => {
  const router = useRouter();
  let { orgName } = router.query;

  // TODO: This is to fix a type issue. Clean this up later
  if (Array.isArray(orgName)) orgName = orgName[0];

  const [isContributionModalOpen, setIsContributionModalOpen] =
    React.useState(false);
  const [isClaimRewardsModalOpen, setIsClaimRewardsModalOpen] =
    React.useState(false);
  const [isGiveRewardsModalOpen, setIsGiveRewardsModalOpen] =
    React.useState(false);
  const handleCloseContributionModal = () => {
    setIsContributionModalOpen(false);
  };
  const handleCloseClaimRewardsModal = () => {
    setIsClaimRewardsModalOpen(false);
  };
  const handleCloseGiveRewardsModal = () => {
    setIsGiveRewardsModalOpen(false);
  };

  const [osContractAddress, setOSContractAddress] = React.useState('');

  const web3 = useWeb3();
  const [, setContracts] = useContracts();

  // get address of OS
  const getOS = async () => {
    const defaultOSFactoryContractAddress = process.env
      .NEXT_PUBLIC_CONTRACT_DEFAULT_OS_FACTORY_ADDRESS as string;

    const osFactoryContract = new ethers.Contract(
      defaultOSFactoryContractAddress,
      defaultOSFactoryABI,
      web3,
    );

    try {
      const address = await osFactoryContract.osMap(
        ethers.utils.formatBytes32String(orgName as string),
      );
      setOSContractAddress(address);
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  // create contract for each module and set the contracts to state
  const getModules = async () => {
    if (!osContractAddress) return;

    const newContracts: any = {};
    const moduleABIs = [
      { name: 'EPC', abi: epochABI },
      { name: 'TKN', abi: tokenABI },
      { name: 'MBR', abi: membersABI },
      { name: 'PAY', abi: peerRewardsABI },
    ];

    const osContract = new ethers.Contract(
      osContractAddress,
      defaultOSABI,
      web3,
    );
    newContracts['OS'] = osContract;

    const requests = moduleABIs.map(async (module) => {
      const moduleAddress = osContract.getModule(
        ethers.utils.toUtf8Bytes(module.name),
      );
      return moduleAddress;
    });

    try {
      const addresses = await Promise.all(requests);
      moduleABIs.map((elem, i) => {
        const newContract = new ethers.Contract(addresses[i], elem.abi, web3);
        newContracts[elem.name] = newContract;
      });
      console.log('newContractsAre', newContracts);
      setContracts((prevState: any) => ({ ...prevState, ...newContracts }));
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  React.useEffect(() => {
    if (!orgName) return;
    getOS();
  }, [orgName]);

  React.useEffect(() => {
    if (!osContractAddress) return;
    getModules();
  }, [osContractAddress]);

  return (
    <>
      <Background />
      <PageWrapper>
        <Title daoName={orgName ? orgName : ''} />
        <ContentWrapper>
          <ContributorsList />
          <OrgSummary />
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
              setIsContributionModalOpen(true);
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
      <ContributionModal
        isOpen={isContributionModalOpen}
        onRequestClose={handleCloseContributionModal}
      />
      <ClaimRewardsModal
        isOpen={isClaimRewardsModalOpen}
        onRequestClose={handleCloseClaimRewardsModal}
      />
      <GiveRewardsModal
        isOpen={isGiveRewardsModalOpen}
        onRequestClose={handleCloseGiveRewardsModal}
      />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
