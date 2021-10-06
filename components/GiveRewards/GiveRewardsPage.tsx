import * as React from 'react';
import Modal from '../shared/Modal';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useAccount, useContracts } from '../../shared/contexts';
import { Divider } from '../shared/Divider';
import { Body1, Heading1, Heading4 } from '../../shared/style/theme';
import { client } from '../../utils/apollo/client';
import {
  PEER_REWARDS_REGISTERED_MEMBERS,
  ALLOCATIONS_FROM_MEMBER,
} from '../../utils/apollo/queries';
import { PeerRewardsRegistration } from '../../utils/apollo/queryTypes';
import { handleError } from '../../utils/contract/helper';

interface ownProps {
  isOpen: boolean;
  onRequestClose?: () => void;
}

const GiveRewards = (props: ownProps): JSX.Element => {
  const { isOpen, onRequestClose } = props;
  const { contracts } = useContracts();
  const account = useAccount();

  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [selectedEpoch, setSelectedEpoch] = useState<number>(0);
  const [loading, isLoading] = useState<boolean>(true);
  const [rewards, setRewards] = useState<Record<string, number>>({});
  const [rewardPercents, setRewardPercents] = useState<
    Record<string, number | null>
  >({});
  const [members, setMembers] = useState<PeerRewardsRegistration[]>([]);
  const [rewardsAvailableToGive, setRewardsAvailableToGive] =
    useState<number>(0);

  const onSelectedEpochChange = (epoch: number): void => {
    epoch = Number(epoch);
    if (epoch < 1 || epoch > currentEpoch || epoch % 1 > 0) return;
    setSelectedEpoch(epoch);
    fetchPeerRewards(epoch);
    setRewards({});
    setRewardPercents({});
  };

  const updatePercents = (newRewards: any): void => {
    const newRewardPercents: any = {};
    let totalPoints = 0;
    for (const k in newRewards) totalPoints += Number(newRewards[k]);
    for (const key in newRewards) {
      const percent = Math.round((newRewards[key] / totalPoints) * 10000) / 100;
      newRewardPercents[key] = percent > 0 ? percent : null;
    }
    setRewardPercents(newRewardPercents);
  };

  const onSingleRewardChange = (key: string, value: number): void => {
    const newRewards = { ...rewards };
    newRewards[key] = value;
    // newRewards[key] = value;
    setRewards(newRewards);
    updatePercents(newRewards);
  };

  const calculateRewardsToGive = (address: string): string => {
    const rewards = Number(rewardPercents[address]) * rewardsAvailableToGive;
    return rewardPercents[address]
      ? `${rewards} / ${rewardPercents[address]} %`
      : '';
  };

  const fetchCurrentEpoch = async (): Promise<number> => {
    const epoch = await contracts.EPC.current();
    setCurrentEpoch(epoch);
    setSelectedEpoch(epoch);
    return epoch;
  };

  const fetchRewardsAvailableToGive = async (): Promise<number> => {
    let pointsRegisteredByMember = await contracts.PAY.pointsRegisteredForEpoch(
      selectedEpoch,
      account,
    );
    let totalPointsRegisteredForEpoch =
      await contracts.PAY.totalPointsRegisteredForEpoch(selectedEpoch);
    //Possible bug if browsing different epochs and contributor epoch rewards changed.
    //Fix later by fetching from subgraph instead
    let epochRewards = await contracts.PAY.CONTRIBUTOR_EPOCH_REWARDS();
    pointsRegisteredByMember = pointsRegisteredByMember.toNumber();
    totalPointsRegisteredForEpoch = totalPointsRegisteredForEpoch.toNumber();
    epochRewards = epochRewards.toNumber();
    return (
      (epochRewards * pointsRegisteredByMember) / totalPointsRegisteredForEpoch
    );
  };

  const fetchPeerRewards = async (epoch: number) => {
    try {
      const os = contracts.OS.address.toLowerCase();
      const registeredMembers = await client.query({
        query: PEER_REWARDS_REGISTERED_MEMBERS,
        variables: {
          os: contracts.OS.address.toLowerCase(),
          epochNumber: epoch,
        },
      });

      const allocations = await client.query({
        query: ALLOCATIONS_FROM_MEMBER,
        variables: {
          os: contracts.OS.address.toLowerCase(),
          member: `${os}-${account}`,
          epochNumber: epoch,
        },
      });

      const newRewards: any = {};
      for (const a in allocations.data.allocations) {
        const allocation = allocations.data.allocations[a];
        newRewards[allocation.to.address] = allocation.points;
      }
      setMembers(registeredMembers.data.rewardsRegistrations);
      setRewards(newRewards);
      updatePercents(newRewards);
    } catch (err: any) {
      handleError(err);
    }
  };

  const configureAllocation = async (address: string, amount: number) => {
    try {
      await contracts.PAY.configureAllocation(address, amount);
    } catch (err: any) {
      handleError(err);
    }
  };

  const commitAllocation = async () => {
    try {
      isLoading(true);
      await contracts.PAY.commitAllocation();
    } catch (err: any) {
      isLoading(false);
      handleError(err);
    } finally {
      isLoading(false);
    }
  };

  const registerForPeerRewards = async () => {
    try {
      isLoading(true);
      await contracts.PAY.register();
    } catch (err: any) {
      isLoading(false);
      handleError(err);
    } finally {
      isLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        isLoading(true);
        const epoch = await fetchCurrentEpoch();
        await fetchPeerRewards(epoch);
        setRewardsAvailableToGive(await fetchRewardsAvailableToGive());
      } catch (err: any) {
        console.log(err);
      } finally {
        isLoading(false);
      }
    };

    if (contracts.OS) {
      fetch();
    }
  }, [contracts]);

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
              onChange={(e: any) => onSelectedEpochChange(e.target.value)}
            />
          </WeekContainer>
        </RewardModalHello>
        <Body1>
          Reward those who empower and enable you to be a better contributor
        </Body1>
      </RewardHeaderArea>
      <BottomCTAContainer>
        {currentEpoch != selectedEpoch ? null : (
          <Button width="100%" onClick={() => registerForPeerRewards()}>
            REGISTER FOR NEXT WEEK
          </Button>
        )}
      </BottomCTAContainer>
      <BottomCTAContainer>
        <Button
          width="100%"
          onClick={() => commitAllocation()}
          disabled={currentEpoch != selectedEpoch}
        >
          SAVE
        </Button>
      </BottomCTAContainer>
      <Divider />
      <RewardTableContainer>
        {loading ? (
          <div>Loading ...</div>
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
            {members.map((registration: PeerRewardsRegistration) => (
              <RewardTableRowContainer
                key={registration.member.address + selectedEpoch}
              >
                <td>@{registration.member.alias}</td>
                <td>{calculateRewardsToGive(registration.member.address)}</td>
                <tr>
                  <RewardTableCell>
                    <Input
                      value={rewards[registration.member.address]}
                      type="number"
                      onChange={(e: any) =>
                        onSingleRewardChange(
                          registration.member.address,
                          e.target.value,
                        )
                      }
                      rightFlatBorder
                      disabled={currentEpoch != selectedEpoch}
                    />
                    <Button
                      onClick={() =>
                        configureAllocation(
                          registration.member.address,
                          rewards[registration.member.address],
                        )
                      }
                      leftFlatBorder
                      disabled={currentEpoch != selectedEpoch}
                    >
                      Reward
                    </Button>
                  </RewardTableCell>
                </tr>
              </RewardTableRowContainer>
            ))}
          </RewardTable>
        )}
      </RewardTableContainer>
    </GiveRewardsModalWrapper>
  );
};

const GiveRewardsModalWrapper = styled(Modal)`
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
  color: white;

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

export default GiveRewards;
