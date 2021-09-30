import { Dispatch, createContext, useContext } from 'react';
import { providers } from 'ethers';

export interface Contracts {
  [key: string]: any;
}

interface ContractsContext {
  setContracts: Dispatch<Contracts>;
  contracts: Contracts | Record<string, never>; // value is either object of contracts or an empty object
}

export const accountContext = createContext<string>('');
export const contractsContext = createContext<ContractsContext>({
  setContracts: () => null,
  contracts: {},
});
export const web3Context = createContext<providers.Provider | undefined>(
  undefined,
);
export const useAccount = (): string => useContext(accountContext);
export const useContracts = (): ContractsContext =>
  useContext(contractsContext);
export const useWeb3 = (): providers.Provider | undefined =>
  useContext(web3Context);
