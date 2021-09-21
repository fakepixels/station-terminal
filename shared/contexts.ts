import * as React from 'react';

export const accountContext = React.createContext<string>('');
export const contractContext = React.createContext<any>(undefined);
export const web3Context = React.createContext<any>(undefined);
export const useAccount = () => React.useContext(accountContext);
export const useContract = () => React.useContext(contractContext);
export const useWeb3 = () => React.useContext(web3Context);
