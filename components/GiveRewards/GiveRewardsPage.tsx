import { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import Modal from '../shared/Modal';
import styled from '@emotion/styled';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useContracts } from '../../shared/contexts';
import { Divider } from '../shared/Divider';
import { Body1, Heading1, Heading4 } from '../../shared/style/theme';
import { PeerRewardsRegistration } from '../../utils/apollo/queryTypes';
import {
  calculateAvailableRewardsToGive,
  handleError,
} from '../../utils/contract/helper';
import {
  fetchAllocationsFromUserPerEpoch,
  fetchRegisteredMembers,
} from '../../utils/apollo/api';

interface ownProps {
  isOpen: boolean;
  onRequestClose?: () => void;
}

const calculateRewardsToGive = (
  percents: Record<string, number | null>,
  availableToGive: number,
  address: string,
): string => {
  const rewards =
    Math.round(Number(percents[address]) * availableToGive * 100) / 10000;
  return percents[address]
    ? `${rewards.toFixed(1)} / ${percents[address]} %`
    : '';
};

const GiveRewards = (props: ownProps): JSX.Element => {
  const { isOpen, onRequestClose } = props;
  const { contracts } = useContracts();
  const { account } = useWeb3React<Web3Provider>();

  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [selectedEpoch, setSelectedEpoch] = useState<number>(0);
  const [loading, isLoading] = useState<boolean>(true);
  const [savedRewards, setSavedRewards] = useState<Record<string, number>>({}); //Separate saved (to the contract) and unsaved inputs to distinguish if user has edited the field
  const [unsavedRewards, setUnsavedRewards] = useState<Record<string, number>>(
    {},
  );
  const [rewardPercents, setRewardPercents] = useState<
    Record<string, number | null>
  >({});
  const [members, setMembers] = useState<PeerRewardsRegistration[]>([]);
  const [rewardsAvailableToGive, setRewardsAvailableToGive] =
    useState<number>(0);

  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [hasCommitted, setHasCommitted] = useState<boolean>(false);

  const onSelectedEpochChange = useCallback(
    (epoch: number): void => {
      epoch = Number(epoch);
      if (epoch < 1 || epoch > currentEpoch || epoch % 1 > 0) return;
      setSelectedEpoch(epoch);
      setSavedRewards({});
      setUnsavedRewards({});
      setRewardPercents({});
      fetchPeerRewards(epoch);
    },
    [currentEpoch],
  );

  const updatePercents = useCallback(
    (newRewards: Record<string, number>): void => {
      const newRewardPercents: Record<string, number | null> = {};
      let totalPoints = 0;
      for (const k in newRewards) totalPoints += Number(newRewards[k]);
      for (const key in newRewards) {
        const percent =
          Math.round((newRewards[key] / totalPoints) * 10000) / 100;
        newRewardPercents[key] = percent > 0 ? percent : null;
      }
      setRewardPercents(newRewardPercents);
    },
    [setRewardPercents],
  );

  const onSingleRewardChange = useCallback(
    (key: string, value: number): void => {
      if (value < 0) return;
      const newRewards = { ...unsavedRewards };
      newRewards[key] = value;
      setUnsavedRewards(newRewards);
      updatePercents(newRewards);
    },
    [setUnsavedRewards, updatePercents, unsavedRewards],
  );

  const fetchCurrentEpoch = useCallback(async (): Promise<number | null> => {
    try {
      const epoch = await contracts.EPC.current();
      setCurrentEpoch(epoch);
      setSelectedEpoch(epoch);
      return epoch;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [setCurrentEpoch, setSelectedEpoch, contracts]);

  // fetch existing peer rewards given epoch from subgraph
  const fetchPeerRewards = async (epoch: number) => {
    try {
      if (!account || !contracts || !contracts.OS) return;
      const os: string = contracts.OS.address.toLowerCase();

      // Gets all allocations that the user gave for th epoch
      const allocations: any = await fetchAllocationsFromUserPerEpoch(
        os,
        account,
        epoch,
      );

      // Saves the allocations in a map so that we can compare with the available members and
      const newRewards: Record<string, number> = {};
      allocations.forEach((allocation: any) => {
        newRewards[allocation.to.address] = allocation.points;
      });

      setMembers(await fetchRegisteredMembers(os, epoch)); // Gets all peer reward registered member for the epoch
      setSavedRewards(newRewards);
      setUnsavedRewards(newRewards);
      updatePercents(newRewards);
    } catch (err: any) {
      handleError(err);
    }
  };

  const configureAllocation = useCallback(
    async (address: string, amount: number) => {
      try {
        await contracts.PAY.configureAllocation(address, amount);
        const newRewards = { ...savedRewards };
        newRewards[address] = amount;
        setSavedRewards(newRewards); // Only saving savedRewards because unsavedRewards is already updated during user input
      } catch (err: any) {
        handleError(err);
      }
    },
    [contracts, setSavedRewards],
  );

  const commitAllocation = useCallback(async () => {
    try {
      isLoading(true);
      await contracts.PAY.commitAllocation();
    } catch (err: any) {
      handleError(err);
    } finally {
      isLoading(false);
    }
  }, [isLoading, contracts]);

  useEffect(() => {
    const fetch = async () => {
      try {
        isLoading(true);
        const epoch = await fetchCurrentEpoch();
        if (!epoch || !account) return;
        await fetchPeerRewards(epoch);
        setRewardsAvailableToGive(
          await calculateAvailableRewardsToGive(contracts, account, epoch),
        );
      } catch (err: any) {
        handleError(err);
      } finally {
        isLoading(false);
      }
    };

    if (contracts.OS) {
      fetch();
    }
  }, [contracts]);

  // set registration date
  useEffect(() => {
    const fetchEligibility = async () => {
      if (!account || !contracts || !contracts.PAY) return;
      try {
        setIsRegistered(
          await contracts.PAY.eligibleForRewards(selectedEpoch, account),
        );
      } catch (err) {
        handleError(err);
      }
    };

    fetchEligibility();
  }, [selectedEpoch, account, contracts]);

  // check whether user has committed yet
  useEffect(() => {
    const fetch = async () => {
      if (!account || !contracts || !contracts.PAY) return;
      try {
        setHasCommitted(
          await contracts.PAY.participationHistory(selectedEpoch, account),
        );
      } catch (err) {
        handleError(err);
      }
    };

    fetch();
  }, [selectedEpoch, account, contracts]);

  const isCurrentEpoch = currentEpoch == selectedEpoch;

  return (
    <GiveRewardsModalWrapper onRequestClose={onRequestClose} isOpen={isOpen}>
      <RewardHeaderArea>
        <RewardModalHello>
          <Heading1>Reward</Heading1>
          <WeekContainer>
            <Body1>Week</Body1>
            <Input
              value={selectedEpoch}
              type="number"
              margin="0px 0px 0px 10px"
              width="70px"
              onChange={(e: any) => onSelectedEpochChange(e.target.value)}
            />
          </WeekContainer>
        </RewardModalHello>
        <RewardSubtitle>
          Reward those who empower and enable you to be a better contributor
        </RewardSubtitle>
        <RewardModalSubheader>
          <Body1>Rewards to give</Body1>
          <Body1>{rewardsAvailableToGive}</Body1>
        </RewardModalSubheader>
      </RewardHeaderArea>

      {isRegistered && isCurrentEpoch && (
        <BottomCTAContainer>
          <Button width="100%" onClick={() => commitAllocation()}>
            SAVE ALL
          </Button>
          <DisclaimerText>
            * Once you save, you cannot allocate this epoch
          </DisclaimerText>
        </BottomCTAContainer>
      )}

      {!isRegistered && (
        <AlertContainer>
          <Body1>* You need to be registered to participate!</Body1>
        </AlertContainer>
      )}

      {isRegistered && (
        <>
          <Divider />
          <RewardTableContainer>
            {loading ? (
              <LoadingTextContainer>Loading ...</LoadingTextContainer>
            ) : (
              <RewardTable>
                <RewardTableRowContainer>
                  <RewardTableHeaderText>
                    <Heading4>Contributors</Heading4>
                  </RewardTableHeaderText>

                  <RewardTableHeaderText>
                    <Heading4>Percent to Reward</Heading4>
                  </RewardTableHeaderText>

                  <RewardTableHeaderText>
                    <Heading4>Points</Heading4>
                  </RewardTableHeaderText>
                </RewardTableRowContainer>
                {members.map((registration: PeerRewardsRegistration) => {
                  const member = registration.member;
                  const unsavedReward = unsavedRewards[member.address];
                  const savedReward = savedRewards[member.address];
                  return (
                    <RewardTableRowContainer
                      key={member.address + selectedEpoch}
                    >
                      <td>
                        <Body1>@{member.alias}</Body1>
                      </td>
                      <tr>
                        <RewardTableCell>
                          <Input
                            value={unsavedReward}
                            type="number"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              onSingleRewardChange(
                                member.address,
                                Number(e.target.value),
                              )
                            }
                            rightFlatBorder
                            disabled={
                              currentEpoch != selectedEpoch || hasCommitted
                            }
                            width="70px"
                          />
                          <Button
                            onClick={() =>
                              configureAllocation(member.address, unsavedReward)
                            }
                            leftFlatBorder
                            disabled={
                              currentEpoch != selectedEpoch ||
                              savedReward == unsavedReward
                            }
                          >
                            Reward
                          </Button>
                        </RewardTableCell>
                      </tr>
                      <td>
                        <Body1>
                          {calculateRewardsToGive(
                            rewardPercents,
                            rewardsAvailableToGive,
                            member.address,
                          )}
                        </Body1>
                      </td>
                    </RewardTableRowContainer>
                  );
                })}
              </RewardTable>
            )}
          </RewardTableContainer>
        </>
      )}
    </GiveRewardsModalWrapper>
  );
};

export default GiveRewards;

const GiveRewardsModalWrapper = styled(Modal)`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: initial;
  border: 1px solid ${(props) => props.theme.colors.gray};
  overflow: auto;
  outline: none;
  margin: 0 auto 0 auto;

  min-height: 600px;
  background: ${(props) => props.theme.colors.black};
  color: ${(props) => props.theme.colors.white};

  @media (min-width: 768px) {
    top: 10vh;
    bottom: initial;
    max-width: 572px;
    max-height: 592px;
  }
`;

const RewardHeaderArea = styled.div`
  padding: 20px;
`;

const RewardModalSubheader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`;

const WeekContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RewardModalHello = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
`;

const RewardTableContainer = styled.div`
  padding: 20px;
`;

const RewardTableHeaderText = styled.th`
  height: 30px;
  text-transform: uppercase;
`;

const RewardTable = styled.table`
  width: 100%;
  overflow-y: scroll;
`;

const RewardTableRowContainer = styled.tr`
  text-align: left;
`;

const RewardTableCell = styled.td`
  text-align: left;
  display: flex;
  flex-direction: row;
`;

const BottomCTAContainer = styled.div`
  padding: 0px 20px 20px 20px;
`;

const DisclaimerText = styled(Body1)`
  color: ${(props) => props.theme.colors.gray};
  margin-top: 6px;
`;

const AlertContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LoadingTextContainer = styled(Body1)`
  color: ${(props) => props.theme.colors.gray};
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  justify-content: center;
`;

const RewardSubtitle = styled(Body1)`
  color: ${(props) => props.theme.colors.gray};
`;
