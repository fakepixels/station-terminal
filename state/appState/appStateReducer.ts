import { createReducer } from '@reduxjs/toolkit';
import { appStateActions, MODAL } from './appStateActions';

export interface appStateProps {
  currentModal: MODAL | null;
}

const initialState: appStateProps = {
  currentModal: null,
};

export const appStateReducer = createReducer(initialState, (builder) => {
  builder.addCase(
    appStateActions.setModal,
    (state: appStateProps, { payload }) => {
      state.currentModal = payload;
    },
  );
});
