import { createReducer } from '@reduxjs/toolkit';
import { Member } from '../../components/ContributorsList';
import { applicationActions } from './applicationActions';

export interface applicationStateProps {
  tokenSymbol: string;
  currentEpoch: string;
  tokenSupply: number | null;
  userBalance: number | null;
  userList: Member[] | null;
}

const initialState: applicationStateProps = {
  tokenSymbol: '',
  currentEpoch: '',
  tokenSupply: null,
  userBalance: null,
  userList: null,
};

export const applicationReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    applicationActions.setTokenSymbol,
    (state: applicationStateProps, { payload }) => {
      state.tokenSymbol = payload;
    },
  );
  builder.addCase(
    applicationActions.setCurrentEpoch,
    (state: applicationStateProps, { payload }) => {
      state.currentEpoch = payload;
    },
  );
  builder.addCase(
    applicationActions.setTotalTokenSupply,
    (state: applicationStateProps, { payload }) => {
      state.tokenSupply = payload;
    },
  );
  builder.addCase(
    applicationActions.setUserBalance,
    (state: applicationStateProps, { payload }) => {
      state.userBalance = payload;
    },
  );
  builder.addCase(
    applicationActions.setUserList,
    (state: applicationStateProps, { payload }) => {
      state.userList = payload;
    },
  );
});
