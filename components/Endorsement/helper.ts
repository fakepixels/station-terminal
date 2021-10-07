import { Member } from '../../apollo/queryTypes';

export enum Page {
  'endorse',
  'mint',
}

// hardecoded minting multplier from contracts
export const MintMultipler = (duration: number): number => {
  if (duration < 50) return 0;
  if (duration >= 50 && duration < 100) return 1;
  if (duration >= 100 && duration < 150) return 3;
  if (duration >= 150 && duration < 200) return 6;
  return 10;
};

export const resolveBigint = (n: number): number => n * 1000;

export const formatMembers = (members: Member[]): Member[] => {
  const newMembers = members.slice(0);
  for (let i = 0; i < newMembers.length; i++) {
    newMembers[i] = {
      ...newMembers[i],
      endorsementsReceived: resolveBigint(
        Number(newMembers[i].endorsementsReceived),
      ).toString(),
    };
  }

  return newMembers;
};
