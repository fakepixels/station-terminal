import { useSelector } from 'react-redux';
import { masterStore } from './../rootReducer';
import { userProfileStateProps } from './userProfileReducer';

export const userProfileSelector = (
  state: masterStore,
): userProfileStateProps => state.userProfile;

// selectors
export const useUserProfile = (): userProfileStateProps => {
  return useSelector(userProfileSelector);
};
