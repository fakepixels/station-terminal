import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useContracts, Contracts } from '../../shared/contexts';
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
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect } from '../../shared/wallet/hooks';
import Login from '../../components/Login/Login';
import Alias from '../../components/Login/AliasBox';
import { handleError } from '../../utils/contract/helper';

declare const window: any;

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
  margin: 0px 50px;
  font-size: 80px;
  @media (max-height: 830px) {
    font-size: 40px;
  }
`;

interface titleProps {
  daoName: string;
}

const Title = (props: titleProps): JSX.Element => {
  const { daoName } = props;
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

const getSigner = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  return provider.getSigner();
};

const moduleABIs = [
  { name: 'EPC', abi: epochABI },
  { name: 'TKN', abi: tokenABI },
  { name: 'MBR', abi: membersABI },
  { name: 'PAY', abi: peerRewardsABI },
];

const Home = (): JSX.Element => {
  const router = useRouter();
  const tried = useEagerConnect();
  const { setContracts, contracts } = useContracts();
  const { account, library } = useWeb3React<Web3Provider>();
  const [step, setStep] = useState<number>(0);

  let { orgName } = router.query;

  // TODO: This is to fix a type issue. Clean this up later
  if (Array.isArray(orgName)) orgName = orgName[0];

  const [osContractAddress, setOSContractAddress] = useState('');

  // get address of OS
  const getOS = async () => {
    if (!orgName || !library) return;
    const defaultOSFactoryContractAddress = process.env
      .NEXT_PUBLIC_CONTRACT_DEFAULT_OS_FACTORY_ADDRESS as string;
    const osFactoryContract = new ethers.Contract(
      defaultOSFactoryContractAddress,
      defaultOSFactoryABI,
      library,
    );

    try {
      const address = await osFactoryContract.osMap(
        ethers.utils.formatBytes32String('testOs'),
      );
      setOSContractAddress(address);
    } catch (err) {
      handleError(err);
    }
  };

  // create contract for each module and set the contracts to state
  const getModules = async () => {
    if (!osContractAddress || !library) return;

    const newContracts: any = {};

    const osContract = new ethers.Contract(
      osContractAddress,
      defaultOSABI,
      library,
    );
    newContracts['OS'] = osContract;

    const requests = moduleABIs.map(async (module) => {
      const moduleAddress = osContract.getModule(
        ethers.utils.toUtf8Bytes(module.name),
      );
      return moduleAddress;
    });

    try {
      const signer = getSigner();
      const addresses = await Promise.all(requests);
      moduleABIs.map((elem, i) => {
        const newContract = new ethers.Contract(addresses[i], elem.abi, signer);
        newContracts[elem.name] = newContract;
      });
      setContracts(
        (prevState: Contracts): Contracts => ({
          ...prevState,
          ...newContracts,
        }),
      );
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    getOS();
  }, [orgName, library]);

  useEffect(() => {
    getModules();
  }, [osContractAddress]);

  // determine the state of user
  useEffect(() => {
    const onMount = async () => {
      if (!account && tried) {
        // logged out state
        setStep(1);
      } else if (account && tried) {
        // Logged in state. check if alias is present
        if (contracts && contracts.MBR && account) {
          const res = await contracts.MBR.getAliasForMember(account);

          if (res === 0) {
            setStep(2);
          } else {
            setStep(3);
          }
        }
      }
    };

    onMount();
  }, [account, tried, contracts]);

  return (
    <>
      {step === 1 && <Login />}
      {step === 2 && <Alias finishAlias={() => setStep(3)} />}
      {step === 3 && (
        <>
          <PageWrapper>
            <Title daoName={orgName ? orgName : ''} />
            <ContentWrapper>
              <ContributorsList />
              <OrgSummary />
            </ContentWrapper>
          </PageWrapper>
          <Footer />
        </>
      )}
    </>
  );
};

Home.getLayout = function getLayout(page: JSX.Element) {
  return <Layout>{page}</Layout>;
};

export default Home;
