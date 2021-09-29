import styled from '@emotion/styled';
import * as React from 'react';
import type { ReactElement } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useWeb3, useContracts, Contracts } from '../../shared/contexts';

import ContributorsList from '../../components/ContributorsList';
import OrgSummary from '../../components/OrgSummary';
import Footer from '../../components/Footer';
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

  const [osContractAddress, setOSContractAddress] = React.useState('');

  const web3 = useWeb3();
  const { setContracts } = useContracts();

  // get address of OS
  const getOS = async () => {
    if (!orgName || !web3) return;
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
      setContracts(
        (prevState: Contracts): Contracts => ({
          ...prevState,
          ...newContracts,
        }),
      );
    } catch (err) {
      console.log('ERROR: ', err);
    }
  };

  React.useEffect(() => {
    getOS();
  }, [orgName, web3]);

  React.useEffect(() => {
    getModules();
  }, [osContractAddress]);

  return (
    <>
      <PageWrapper>
        <Title daoName={orgName ? orgName : ''} />
        <ContentWrapper>
          <ContributorsList />
          <OrgSummary />
        </ContentWrapper>
      </PageWrapper>
      <Footer></Footer>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
