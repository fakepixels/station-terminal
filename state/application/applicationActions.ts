import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit';
import { Member } from '../../components/ContributorsList';

export const APPLICATION_ACTIONS = {
  SET_TOKEN_SYMBOL: 'SET_TOKEN_SYMBOL',
  SET_CURRENT_EPOCH: 'SET_CURRENT_EPOCH',
  SET_TOTAL_TOKEN_SUPPLY: 'SET_TOTAL_TOKEN_SUPPLY',
  SET_USER_BALANCE: 'SET_USER_BALANCE',
  SET_USER_LIST: 'SET_USER_LIST',
};

export const applicationActions: Readonly<{
  setTokenSymbol: ActionCreatorWithPayload<string>;
  setCurrentEpoch: ActionCreatorWithPayload<string>;
  setTotalTokenSupply: ActionCreatorWithPayload<number>;
  setUserBalance: ActionCreatorWithPayload<number>;
  setUserList: ActionCreatorWithPayload<Member[]>;
}> = {
  setTokenSymbol: createAction(APPLICATION_ACTIONS.SET_TOKEN_SYMBOL),
  setCurrentEpoch: createAction(APPLICATION_ACTIONS.SET_CURRENT_EPOCH),
  setTotalTokenSupply: createAction(APPLICATION_ACTIONS.SET_TOTAL_TOKEN_SUPPLY),
  setUserBalance: createAction(APPLICATION_ACTIONS.SET_USER_BALANCE),
  setUserList: createAction(APPLICATION_ACTIONS.SET_USER_LIST),
};
