import * as React from 'react';

export const accountContext = React.createContext<string>('');
// TODO: Fix types
export const contractsContext = React.createContext<any>(undefined);
export const web3Context = React.createContext<any>(undefined);
export const useAccount = () => React.useContext(accountContext);
export const useContracts = () => React.useContext(contractsContext);
export const useWeb3 = () => React.useContext(web3Context);
