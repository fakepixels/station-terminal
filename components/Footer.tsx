import styled from '@emotion/styled';
import { useState } from 'react';
import Button from '../components/shared/Button';
import ClaimRewardsModal from './ClaimRewards/ClaimRewardsPage';
import GiveRewardsModal from './GiveRewards/GiveRewardsPage';
import EndorsementModal from './Endorsement/EndorsementPage';
import ContributorProfileModal from './ContributorProfile/ContributorProfile';
import { useDispatch } from 'react-redux';
import { useApplicationState } from '../state/application/applicationSelectors';
import { useAppState } from '../state/appState/appStateSelectors';
import { appStateActions, MODAL } from '../state/appState/appStateActions';

const FooterWrapper = styled.div`
  width: 100%;
  height: 140px;
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
  const dispatch = useDispatch();
  const layoutState = useAppState();
  const applicationState = useApplicationState();
  const appState = useApplicationState();

  const [totalTokensStaked] = useState<number>(0);
  const [totalEndorsementsReceived] = useState<number | null>(0);

  const [isClaimRewardsModalOpen, setIsClaimRewardsModalOpen] =
    useState<boolean>(false);
  const [isGiveRewardsModalOpen, setIsGiveRewardsModalOpen] =
    useState<boolean>(false);
  const [isEndorsementModalOpen, setIsEndorsementModalOpen] =
    useState<boolean>(false);

  const handleCloseClaimRewardsModal = () => {
    setIsClaimRewardsModalOpen(false);
  };
  const handleCloseGiveRewardsModal = () => {
    setIsGiveRewardsModalOpen(false);
  };
  const handleCloseEndorsementModal = () => {
    setIsEndorsementModalOpen(false);
  };

  const calculatePctOwnership = (): number => {
    if (!appState.tokenSupply || !appState.userBalance) return 0;
    return (appState.userBalance + totalTokensStaked) / appState.tokenSupply;
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
      <ContributorProfileModal
        isOpen={layoutState.currentModal === MODAL.CONTRIBUTOR_PROFILE}
        onRequestClose={() => dispatch(appStateActions.setModal(null))}
      />
      <GiveRewardsModal
        isOpen={isGiveRewardsModalOpen}
        onRequestClose={handleCloseGiveRewardsModal}
      />
      <FooterWrapper>
        <FooterStats>
          <FooterStat
            description={'YOUR TOTAL $' + applicationState.tokenSymbol}
            value={(appState.userBalance || 0 + totalTokensStaked).toString()}
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
