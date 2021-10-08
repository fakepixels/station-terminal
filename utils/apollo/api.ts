import {
  PEER_REWARDS_REGISTERED_MEMBERS,
  ALLOCATIONS_FROM_MEMBER,
} from './queries';
import { client } from './client';

// fetch list of registered member this epoch
export const fetchRegisteredMembers = async (
  os: string,
  epoch: number,
): Promise<any[]> => {
  try {
    const registeredMembers = await client.query({
      query: PEER_REWARDS_REGISTERED_MEMBERS,
      variables: {
        os,
        epochNumber: epoch,
      },
    });

    return registeredMembers.data.rewardsRegistrations;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

// fetch allocations from a user per epoch
export const fetchAllocationsFromUserPerEpoch = async (
  os: string,
  account: string,
  epoch: number,
): Promise<Record<string, number>[]> => {
  try {
    const allocations = await client.query({
      query: ALLOCATIONS_FROM_MEMBER,
      variables: {
        os,
        from: `${os}-${account.toLowerCase()}`,
        epochNumber: epoch,
      },
    });

    return allocations.data.allocations;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
