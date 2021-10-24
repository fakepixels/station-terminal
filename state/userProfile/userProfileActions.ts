import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit';

export const APPLICATION_ACTIONS = {
  SET_CONTRIBUTOR_PROFILE_MODAL: 'SET_CONTRIBUTOR_PROFILE_MODAL',
  SET_SELECTED_DIRECTORY_USER: 'SET_SELECTED_DIRECTORY_USER',
};

export const userProfileActions: Readonly<{
  setSelectedDirectoryUser: ActionCreatorWithPayload<string>;
  setContributorProfileModal: ActionCreatorWithPayload<boolean>;
}> = {
  setSelectedDirectoryUser: createAction(
    APPLICATION_ACTIONS.SET_SELECTED_DIRECTORY_USER,
  ),
  setContributorProfileModal: createAction(
    APPLICATION_ACTIONS.SET_CONTRIBUTOR_PROFILE_MODAL,
  ),
};
