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
import { PEER_REWARDS_CLAIMABLE } from '../../utils/apollo/queries';
import { Allocation } from '../../utils/apollo/queryTypes';
import { handleError } from '../../utils/contract/helper';

interface ownProps {
  isOpen: boolean;
  onRequestClose?: () => void;
}

const ClaimRewards = (props: ownProps): JSX.Element => {
  const { isOpen, onRequestClose } = props;
  const { contracts } = useContracts();
  const account = useAccount();

  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [selectedEpoch, setSelectedEpoch] = useState<number>(0);
  const [loading, isLoading] = useState<boolean>(true);
  const [members, setMembers] = useState<Allocation[]>([]);

  const onSelectedEpochChange = (epoch: number): void => {
    epoch = Number(epoch);
    if (epoch < 1 || epoch > currentEpoch || epoch % 1 > 0) return;
    setSelectedEpoch(epoch);
    fetchClaimableRewards(epoch);
  };

  const calculateRewardPercentage = (reward: number): number => {
    let total = 0;
    for (const key in members) total += members[key].rewards;
    return Math.round((reward / total) * 10000) / 100;
  };

  const fetchCurrentEpoch = async (): Promise<number> => {
    const epoch = await contracts.EPC.current();
    setCurrentEpoch(epoch);
    setSelectedEpoch(epoch);
    return epoch;
  };

  const fetchClaimableRewards = async (epoch: number) => {
    try {
      const os = contracts.OS.address.toLowerCase();
      const rewardsFromMembers = await client.query({
        query: PEER_REWARDS_CLAIMABLE,
        variables: {
          os: contracts.OS.address.toLowerCase(),
          member: `${os}-${account}`,
          epochNumber: epoch,
        },
      });

      setMembers(rewardsFromMembers.data.allocations);
    } catch (err: any) {
      handleError(err);
    }
  };

  const claimRewards = async () => {
    try {
      isLoading(true);
      await contracts.PAY.claimRewards();
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
        await fetchClaimableRewards(epoch);
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
          <Body1>Rewards received</Body1>
          <Body1>100</Body1>
        </RewardModalSubheader>
      </RewardHeaderArea>
      <BottomCTAContainer>
        <Button
          width="100%"
          onClick={() => claimRewards()}
          disabled={currentEpoch == selectedEpoch}
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
            {members.map((allocation: Allocation) => (
              <RewardTableRowContainer
                key={allocation.from.address + selectedEpoch}
              >
                <td>@{allocation.from.alias}</td>
                <td>{`${allocation.rewards} / ${calculateRewardPercentage(
                  allocation.rewards,
                )}`}</td>
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

const BottomCTAContainer = styled.div`
  padding: 0px 20px 20px 20px;
`;

export default ClaimRewards;
