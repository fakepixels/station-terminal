import { createReducer } from '@reduxjs/toolkit';
import { userProfileActions } from './userProfileActions';

export interface userProfileStateProps {
  selectedUser: string;
  isContributorProfileOpen: boolean;
}

const initialState: userProfileStateProps = {
  selectedUser: '',
  isContributorProfileOpen: false,
};

export const userProfileReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    userProfileActions.setSelectedDirectoryUser,
    (state: userProfileStateProps, { payload }) => {
      state.selectedUser = payload;
    },
  );
  builder.addCase(
    userProfileActions.setContributorProfileModal,
    (state: userProfileStateProps, { payload }) => {
      state.isContributorProfileOpen = payload;
    },
  );
});
