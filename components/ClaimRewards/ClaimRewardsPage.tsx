import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import Modal from '../shared/Modal';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useContracts } from '../../shared/contexts';
import { Divider } from '../shared/Divider';
import { Body1, Heading1, Heading4 } from '../../shared/style/theme';
import { client } from '../../utils/apollo/client';
import {
  PEER_REWARDS_FOR_EPOCH,
  UNCLAIMED_PEER_REWARDS,
} from '../../utils/apollo/queries';
import { Allocation } from '../../utils/apollo/queryTypes';
import { handleError } from '../../utils/contract/helper';

interface ownProps {
  isOpen: boolean;
  onRequestClose?: () => void;
}

const ClaimRewards = (props: ownProps): JSX.Element => {
  const { isOpen, onRequestClose } = props;
  const { contracts } = useContracts();
  const { account } = useWeb3React<Web3Provider>();

  const [loading, isLoading] = useState<boolean>(true);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [selectedEpoch, setSelectedEpoch] = useState<number>(0);
  const [unclaimedRewards, setUnclaimedRewards] = useState<number>(0);
  const [allocationsForEpoch, setAllocationsForEpoch] = useState<Allocation[]>(
    [],
  );

  const onSelectedEpochChange = (epoch: number): void => {
    epoch = Number(epoch);
    if (epoch < 1 || epoch > currentEpoch || epoch % 1 > 0) return;
    setSelectedEpoch(epoch);
    fetchClaimableRewardsForEpoch(epoch);
  };

  //For aggregating total rewards in allocation list for an epoch
  const calculateTotalRewardsRecieved = (): number => {
    let total = 0;
    for (const key in allocationsForEpoch)
      total += Number(allocationsForEpoch[key].rewards);
    return total;
  };

  //For calculating percentage of reward of an allocation for the list for an epoch
  const calculateRewardPercentage = (reward: number): number => {
    const total = calculateTotalRewardsRecieved();
    return Math.round((reward / total) * 10000) / 100;
  };

  const fetchCurrentEpoch = async (): Promise<number> => {
    const epoch = await contracts.EPC.current();
    setCurrentEpoch(epoch);
    setSelectedEpoch(epoch);
    return epoch;
  };

  //For saving the list of allocations for an epoch
  const fetchClaimableRewardsForEpoch = async (epoch: number) => {
    try {
      if (!account || !contracts || !contracts.OS) return;

      const os = contracts.OS.address.toLowerCase();
      const rewardsFromMembers = await client.query({
        query: PEER_REWARDS_FOR_EPOCH,
        variables: {
          os,
          to: `${os}-${account.toLowerCase()}`,
          epochNumber: epoch,
        },
      });

      setAllocationsForEpoch(rewardsFromMembers.data.allocations);
    } catch (err: any) {
      handleError(err);
    }
  };

  //For saving the aggregation of claimable rewards
  const fetchUnclaimedRewards = async () => {
    try {
      if (!account || !contracts || !contracts.OS) return;

      //Get last epoch the user claimd the rewards
      const lastEpochClaimed = await contracts.PAY.lastEpochClaimed(account);

      //Fetch unclaimed rewards since last epoch claimed (greater than "_gt" query on the graph)
      const os = contracts.OS.address.toLowerCase();
      const unclaimedRewards = await client.query({
        query: UNCLAIMED_PEER_REWARDS,
        variables: {
          os,
          to: `${os}-${account.toLowerCase()}`,
          epochNumber: lastEpochClaimed,
        },
      });

      //Aggregate all the unclaimed rewards given
      const total = unclaimedRewards.data.allocations.reduce(
        (prev: number, cur: any) => {
          return prev + Number(cur.rewards);
        },
        0,
      );

      setUnclaimedRewards(total);
    } catch (err: any) {
      handleError(err);
    }
  };

  const claimRewards = async () => {
    try {
      isLoading(true);
      await contracts.PAY.claimRewards();
      setUnclaimedRewards(0);
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
        await fetchClaimableRewardsForEpoch(epoch);
        await fetchUnclaimedRewards();
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
    <ClaimRewardsModalWrapper onRequestClose={onRequestClose} isOpen={isOpen}>
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
        <RewardModalSubheader>
          <Body1>Rewards unclaimed</Body1>
          <Body1>{unclaimedRewards}</Body1>
        </RewardModalSubheader>
        <RewardModalSubheader>
          <Body1>Rewards received in week {selectedEpoch}</Body1>
          <Body1>{calculateTotalRewardsRecieved()}</Body1>
        </RewardModalSubheader>
      </RewardHeaderArea>
      <BottomCTAContainer>
        <Button
          width="100%"
          onClick={() => claimRewards()}
          disabled={unclaimedRewards <= 0}
        >
          CLAIM
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
                <Heading4>Amount received ($RAIL / %)</Heading4>
              </RewardTableHeaderText>
            </RewardTableRowContainer>
            {allocationsForEpoch.map((allocation: Allocation) => (
              <RewardTableRowContainer
                key={allocation.from.address + selectedEpoch}
              >
                <td>@{allocation.from.alias}</td>
                <td>{`${allocation.rewards} / ${calculateRewardPercentage(
                  allocation.rewards,
                )} %`}</td>
              </RewardTableRowContainer>
            ))}
          </RewardTable>
        )}
      </RewardTableContainer>
    </ClaimRewardsModalWrapper>
  );
};

const ClaimRewardsModalWrapper = styled(Modal)`
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

const RewardModalSubheader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
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
  margin-bottom: 15px;
`;

const BottomCTAContainer = styled.div`
  padding: 0px 20px 20px 20px;
`;

export default ClaimRewards;
