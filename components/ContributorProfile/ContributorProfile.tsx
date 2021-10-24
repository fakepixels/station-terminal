import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Body1, Heading1, Heading4 } from '../../shared/style/theme';
import Button from '../shared/Button';
import { Divider } from '../shared/Divider';
import Modal from '../shared/Modal';
import Input from '../shared/Input';
import { useApplicationState } from '../../state/application/applicationSelectors';
import { useContracts } from '../../shared/contexts';
import { useUserProfile } from '../../state/userProfile/userProfileSelectors';
import {
  PEER_REWARDS_FOR_EPOCH,
  REWARD_GIVEN,
} from '../../utils/apollo/queries';
import { client } from '../../utils/apollo/client';
import { handleError } from '../../utils/contract/helper';
import { Allocation } from '../../utils/apollo/queryTypes';

interface ownProps {
  isOpen: boolean;
  onRequestClose?: () => void;
}

const getTotalAllocationsGivenOrReceived = (
  allocations: Allocation[],
): number => {
  return allocations.reduce((total, allocation) => {
    return total + Number(allocation.rewards);
  }, 0);
};

const calculateAllocationPercentage = (
  individualAmount: number,
  totalAmount: number,
): number => {
  return Number(((individualAmount / totalAmount) * 100).toFixed(2));
};

const calculateAllocationPercentageForAllocations = (
  allocation: any,
  allAllocations: Allocation[],
) => {
  const totalAllocationAmount =
    getTotalAllocationsGivenOrReceived(allAllocations);
  return calculateAllocationPercentage(allocation, totalAllocationAmount);
};

const ContributorProfileModal = (props: ownProps): JSX.Element => {
  const { isOpen, onRequestClose } = props;
  const { contracts } = useContracts();
  const userProfile = useUserProfile();
  const appState = useApplicationState();

  const [selectedEpoch, setSelectedEpoch] = useState<number>(
    Number(appState.currentEpoch),
  );
  const [selectedRewardState, setSelectedRewardState] = useState<number>(0);
  const [allocationsForEpoch, setAllocationsForEpoch] = useState<Allocation[]>(
    [],
  );
  const [allocationsGivenThisEpoch, setAllocationsGivenThisEpoch] = useState<
    Allocation[]
  >([]);
  const [userTokenBalance, setUserTokenBalance] = useState<number>(0);

  const calculatePctOwnership = (): number => {
    if (!appState.tokenSupply || !appState.userBalance) return 0;
    return appState.userBalance / appState.tokenSupply;
  };

  const selectUserAlias = (): string => {
    const selectedUser = appState.userList?.filter(
      (user) => user.address === userProfile.selectedUser,
    );
    if (!selectedUser || selectedUser.length == 0) return '';
    return selectedUser[0].alias;
  };

  const onSelectedEpochChange = (epoch: number): void => {
    epoch = Number(epoch);
    if (epoch < 1 || epoch > Number(appState.currentEpoch) || epoch % 1 > 0)
      return;
    setSelectedEpoch(epoch);
    fetchClaimableRewardsForEpoch(epoch);
  };

  const fetchClaimableRewardsForEpoch = async (epoch: number) => {
    try {
      if (!contracts || !contracts.OS) return;

      const os = contracts.OS.address.toLowerCase();
      const rewardsFromMembers = await client.query({
        query: PEER_REWARDS_FOR_EPOCH,
        variables: {
          os,
          to: `${os}-${userProfile.selectedUser.toLowerCase()}`,
          epochNumber: epoch,
        },
      });

      setAllocationsForEpoch(rewardsFromMembers.data.committedAllocations);
    } catch (err: any) {
      handleError(err);
    }
  };

  const fetchGivenRewardsForEpoch = async (
    epoch: number,
    userAddress: string,
  ) => {
    try {
      if (!contracts || !contracts.OS) return;

      const os = contracts.OS.address.toLowerCase();
      const rewardsToMember = await client.query({
        query: REWARD_GIVEN,
        variables: {
          os,
          from: `${os}-${userAddress.toLowerCase()}`,
          epochNumber: epoch,
        },
      });

      setAllocationsGivenThisEpoch(rewardsToMember.data.committedAllocations);
    } catch (err: any) {
      handleError(err);
    }
  };

  const getTokenBalance = async (account: string) => {
    if (!contracts || !contracts.TKN || !account) return;
    try {
      const res = await contracts.TKN.balanceOf(account);
      setUserTokenBalance(res.toNumber());
    } catch (err: any) {
      handleError(err);
    }
  };

  // fetch rewards given
  useEffect(() => {
    const fetchData = async () => {
      await fetchGivenRewardsForEpoch(selectedEpoch, userProfile.selectedUser);
    };
    fetchData();
  }, [userProfile.selectedUser, contracts, selectedEpoch]);

  // fetch rewards received
  useEffect(() => {
    const fetchData = async () => {
      await fetchClaimableRewardsForEpoch(selectedEpoch);
    };
    fetchData();
  }, [userProfile.selectedUser, contracts, selectedEpoch]);

  useEffect(() => {
    const fetchData = async () => {
      await getTokenBalance(userProfile.selectedUser);
    };
    fetchData();
  }, [userProfile.selectedUser, contracts]);

  return (
    <ContributorProfileModalContainer
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <>
        <ContributorProfileHeaderContainer>
          <ContributorProfileModalHello>
            <Heading1>{selectUserAlias()}</Heading1>
            <WeekContainer>
              <Body1>Week</Body1>
              <Input
                value={selectedEpoch}
                type="number"
                width="70px"
                margin="0px 0px 0px 10px"
                onChange={(e: any) => onSelectedEpochChange(e.target.value)}
              />
            </WeekContainer>
          </ContributorProfileModalHello>
          <RowContainer>
            <Body1>Ownership</Body1>
            <Body1>{calculatePctOwnership().toFixed(2) + '%'}</Body1>
          </RowContainer>
          <RowContainer>
            <Body1>Total ${appState.tokenSymbol} </Body1>
            <Body1>{userTokenBalance}</Body1>
          </RowContainer>
          <RowContainer>
            <Body1>Total Endorsements Received</Body1>
            <Body1>
              {getTotalAllocationsGivenOrReceived(allocationsForEpoch)}
            </Body1>
          </RowContainer>
        </ContributorProfileHeaderContainer>

        <Divider />

        <ContributorProfileBottomContainer>
          <ButtonToggleContainer>
            <RewardedButton
              secondary
              selected={selectedRewardState === 0}
              onClick={() => setSelectedRewardState(0)}
            >
              Rewarded
            </RewardedButton>
            <Button
              secondary
              selected={selectedRewardState === 1}
              onClick={() => setSelectedRewardState(1)}
            >
              Received
            </Button>
          </ButtonToggleContainer>

          <EndorsementTable>
            <EndorsementTableRowContainer>
              <TableHeaderText>
                <Heading4>Contributors</Heading4>
              </TableHeaderText>
              <TableHeaderText>
                <Heading4>Amount (${appState.tokenSymbol}/%)</Heading4>
              </TableHeaderText>
            </EndorsementTableRowContainer>

            {selectedRewardState === 0 && (
              <>
                {allocationsGivenThisEpoch.map((allocation) => (
                  <EndorsementTableRowContainer key={allocation.to?.address}>
                    <AliasColumn>@{allocation.to?.alias}</AliasColumn>
                    <td>
                      {allocation.rewards} /{' '}
                      {calculateAllocationPercentageForAllocations(
                        allocation.rewards,
                        allocationsGivenThisEpoch,
                      )}
                      %
                    </td>
                  </EndorsementTableRowContainer>
                ))}
              </>
            )}

            {selectedRewardState === 1 && (
              <>
                {allocationsForEpoch.map((allocation) => (
                  <EndorsementTableRowContainer key={allocation.from?.address}>
                    <AliasColumn>@{allocation.from?.alias}</AliasColumn>
                    <td>
                      {allocation.rewards} /{' '}
                      {calculateAllocationPercentageForAllocations(
                        allocation.rewards,
                        allocationsForEpoch,
                      )}
                      %
                    </td>
                  </EndorsementTableRowContainer>
                ))}
              </>
            )}
          </EndorsementTable>
        </ContributorProfileBottomContainer>
      </>
    </ContributorProfileModalContainer>
  );
};

export default ContributorProfileModal;

const ContributorProfileModalContainer = styled(Modal)`
  position: absolute;
  top: 10vh;
  left: 0px;
  right: 0px;
  bottom: initial;
  border: 1px solid ${(props) => props.theme.colors.gray};
  overflow: auto;
  outline: none;
  margin: 0 auto 0 auto;

  min-height: 592px;
  background: ${(props) => props.theme.colors.black};
  color: ${(props) => props.theme.colors.white};

  @media (min-width: 768px) {
    top: 10vh;
    bottom: initial;
    max-width: 572px;
    max-height: 592px;
  }
`;

const ContributorProfileHeaderContainer = styled.div`
  padding: 20px;
`;

const ContributorProfileBottomContainer = styled.div`
  padding: 20px;
`;

const ButtonToggleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RewardedButton = styled(Button)`
  margin-right: 8px;
`;

const ContributorProfileModalHello = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
`;

const RowContainer = styled.div`
  margin: 8px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const WeekContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const TableHeaderText = styled.th`
  height: 30px;
  text-transform: uppercase;
`;

const EndorsementTable = styled.table`
  margin-top: 16px;
  width: 100%;
`;

const EndorsementTableRowContainer = styled.tr`
  text-align: left;
  line-height: 24px;
`;

const AliasColumn = styled.td`
  width: 260px;
`;
