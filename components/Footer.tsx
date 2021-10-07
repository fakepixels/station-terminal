import styled from '@emotion/styled';
import * as React from 'react';
import { useContracts, useAccount } from '../shared/contexts';
import Button from '../components/shared/Button';
import ClaimRewardsModal from './ClaimRewards/ClaimRewardsPage';
import GiveRewardsModal from './GiveRewards/GiveRewardsPage';
import EndorsementModal from './Endorsement/EndorsementPage';
import { handleError } from '../utils/contract/helper';

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

const FooterActionButton = styled(Button)`
  width: 200px;
`;

const Footer = (): JSX.Element => {
  const { contracts } = useContracts();
  const account = useAccount();

  const [tokenSymbol, setTokenSymbol] = React.useState('');
  const [totalTokenSupply, setTokenSupply] = React.useState(0);
  const [totalTokensOwned, setTokensOwned] = React.useState(0);
  // TODO: count staked tokens
  const [totalTokensStaked] = React.useState(0);
  const [totalEndorsementsReceived] = React.useState<number | null>(0);

  const [isClaimRewardsModalOpen, setIsClaimRewardsModalOpen] =
    React.useState(false);
  const [isGiveRewardsModalOpen, setIsGiveRewardsModalOpen] =
    React.useState(false);
  const [isEndorsementModalOpen, setIsEndorsementModalOpen] =
    React.useState<boolean>(false);

  const handleCloseClaimRewardsModal = () => {
    setIsClaimRewardsModalOpen(false);
  };
  const handleCloseGiveRewardsModal = () => {
    setIsGiveRewardsModalOpen(false);
  };
  const handleCloseEndorsementModal = () => {
    setIsEndorsementModalOpen(false);
  };

  const getSymbol = async () => {
    if (!contracts || !contracts.TKN) return;
    try {
      const res = await contracts.TKN.symbol();
      setTokenSymbol(res);
    } catch (err) {
      handleError(err);
    }
  };

  const getTokenSupply = async () => {
    if (!contracts || !contracts.TKN) return;
    try {
      const res = await contracts.TKN.totalSupply();
      setTokenSupply(res.toNumber());
    } catch (err) {
      handleError(err);
    }
  };

  const getTokenBalance = async (account: string) => {
    if (!contracts || !contracts.TKN || !account) return;
    try {
      const res = await contracts.TKN.balanceOf(account);
      setTokensOwned(res.toNumber());
    } catch (err) {
      handleError(err);
    }
  };

  React.useEffect(() => {
    getSymbol();
    getTokenSupply();
    getTokenBalance(account);
  }, [contracts]);

  React.useEffect(() => {
    if (!account || !contracts) return;
    getTokenBalance(account);
  }, [account, contracts]);

  const calculatePctOwnership = (): number => {
    if (!totalTokenSupply) return 0;
    return (totalTokensOwned + totalTokensStaked) / totalTokenSupply;
  };

  return (
    <>
      <ClaimRewardsModal
        isOpen={isClaimRewardsModalOpen}
        onRequestClose={handleCloseClaimRewardsModal}
      />
      <EndorsementModal
        isOpen={isEndorsementModalOpen}
        onRequestClose={handleCloseEndorsementModal}
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
            value={totalEndorsementsReceived?.toString() || ''}
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
              setIsEndorsementModalOpen(true);
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
