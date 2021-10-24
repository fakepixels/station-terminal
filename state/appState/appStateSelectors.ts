import { useSelector } from 'react-redux';
import { masterStore } from './../rootReducer';
import { appStateProps } from './appStateReducer';

export const stateSelector = (state: masterStore): appStateProps =>
  state.appState;

// selectors
export const useAppState = (): appStateProps => {
  return useSelector(stateSelector);
};
