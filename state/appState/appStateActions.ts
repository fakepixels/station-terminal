import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit';

export enum MODAL {
  CONTRIBUTOR_PROFILE,
}

export const APPLICATION_ACTIONS = {
  SET_MODAL: 'SET_MODAL',
};

export const appStateActions: Readonly<{
  setModal: ActionCreatorWithPayload<MODAL | null>;
}> = {
  setModal: createAction(APPLICATION_ACTIONS.SET_MODAL),
};
