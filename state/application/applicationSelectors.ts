import { useSelector } from 'react-redux';
import { masterStore } from './../rootReducer';
import { applicationStateProps } from './applicationReducer';

export const stateSelector = (state: masterStore): applicationStateProps =>
  state.application;

// selectors
export const useApplicationState = (): applicationStateProps => {
  return useSelector(stateSelector);
};
