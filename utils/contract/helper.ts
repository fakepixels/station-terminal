import { Contract } from '@ethersproject/contracts';
import { Contracts } from './../../shared/contexts';
import { BigNumber } from '@ethersproject/bignumber';
import { toast } from 'react-toastify';

export const handleError = async (err: any): Promise<void> => {
  if (err.data && err.data.message) toast.error(err.data.message);
  else if (err.message) toast.error(err.message);
};

export const getAvailableEndorsements = async (
  contract: Contract,
  account: string,
): Promise<number> => {
  try {
    const totalAvailable = await contract.totalEndorsementsAvailableToGive(
      account,
    );
    const totalGiven = await contract.totalEndorsementsGiven(account);
    return totalAvailable.toNumber() - totalGiven.toNumber();
  } catch (err: any) {
    throw new Error(err);
  }
};

export const calculateAvailableRewardsToGive = async (
  contracts: Contracts,
  account: string,
  epoch: number,
): Promise<number> => {
  try {
    if (!account || !contracts || !contracts.PAY) return 0;

    const pointsRegisteredByMember: BigNumber =
      await contracts.PAY.pointsRegisteredForEpoch(epoch, account);
    const totalPointsRegisteredForEpoch: BigNumber =
      await contracts.PAY.totalPointsRegisteredForEpoch(epoch);

    //Possible bug if browsing different epochs and contributor epoch rewards changed.
    //Fix later by fetching from subgraph instead
    const epochRewards: BigNumber =
      await contracts.PAY.CONTRIBUTOR_EPOCH_REWARDS();

    return (
      Math.round(
        epochRewards.toNumber() *
          (pointsRegisteredByMember.toNumber() /
            totalPointsRegisteredForEpoch.toNumber()) *
          1000,
      ) / 1000
    );
  } catch (err: any) {
    throw new Error(err.message);
  }
};
