import * as React from 'react';

export const accountContext = React.createContext<string>('');
export const contractContext = React.createContext<any>(undefined);
export const useAccount = () => React.useContext(accountContext);
export const useContract = () => React.useContext(contractContext);
