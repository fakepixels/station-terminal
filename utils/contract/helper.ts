import { toast } from 'react-toastify';

export const getAvailableEndorsements = async (
  contract: any,
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

export const handleError = async (err: any): Promise<void> => {
  if (err.data && err.data.message) toast.error(err.data.message);
  else if (err.message) toast.error(err.message);
};
