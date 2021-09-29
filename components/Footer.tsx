import styled from '@emotion/styled';
import * as React from 'react';
import { useContracts, useAccount } from '../shared/contexts';

import Button from '../components/shared/Button';
import ContributionModal from '../components/Contributions/ContributionsModal';
import ClaimRewardsModal from '../components/ClaimRewards/ClaimRewardsModal';
import GiveRewardsModal from '../components/GiveRewards/GiveRewardsModal';

const FooterWrapper = styled.div`
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

const Footer = (): JSX.Element => {
  const [contracts] = useContracts();
  const account = useAccount();
  const [tokenSymbol, setTokenSymbol] = React.useState('');
  const [totalTokenSupply, setTokenSupply] = React.useState(0);
  const [totalTokensOwned, setTokensOwned] = React.useState(0);
  // TODO: count staked tokens
  const [totalTokensStaked] = React.useState(0);

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

  const getSymbol = async () => {
    if (!contracts || !contracts.TKN) return;
    try {
      const res = await contracts.TKN.symbol();
      setTokenSymbol(res);
    } catch (err) {
      console.log('ERR: ', err);
    }
  };

  const getTokenSupply = async () => {
    if (!contracts || !contracts.TKN) return;
    try {
      const res = await contracts.TKN.totalSupply();
      setTokenSupply(res.toNumber());
    } catch (err) {
      console.log('ERR: ', err);
    }
  };

  const getTokenBalance = async (account: string) => {
    if (!contracts || !contracts.TKN) return;
    try {
      const res = await contracts.TKN.balanceOf(account);
      setTokensOwned(res);
    } catch (err) {
      console.log('ERR: ', err);
    }
  };

  React.useEffect(() => {
    getSymbol();
    getTokenSupply();
  }, [contracts]);

  React.useEffect(() => {
    if (!account || !contracts) return;
    getTokenBalance(account);
  }, [account, contracts]);

  const calculatePctOwnership = () => {
    if (!totalTokenSupply) return 0;
    return (totalTokensOwned + totalTokensStaked) / totalTokenSupply;
  };

  return (
    <>
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
      <FooterWrapper>
        <FooterStats>
          <FooterStat
            description={'YOUR TOTAL $' + tokenSymbol}
            value={(totalTokensOwned + totalTokensStaked).toString()}
          />
          <FooterStat
            description={'YOUR OWNERSHIP'}
            value={calculatePctOwnership().toFixed(2) + '%'}
          />
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
      </FooterWrapper>
      ;
    </>
  );
};

export default Footer;
