import { Dispatch, createContext, useContext } from 'react';

export interface Contracts {
  [key: string]: any;
}

interface ContractsContext {
  setContracts: Dispatch<Contracts>;
  contracts: Contracts | Record<string, never>; // value is either object of contracts or an empty object
}

export const contractsContext = createContext<ContractsContext>({
  setContracts: () => null,
  contracts: {},
});

export const useContracts = (): ContractsContext =>
  useContext(contractsContext);

export const endorsementContext = createContext<any>(undefined);
export const useEndorsement = () => useContext(endorsementContext);
