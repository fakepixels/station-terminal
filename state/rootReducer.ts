import { combineReducers } from 'redux';

// reducers
import {
  applicationReducer,
  applicationStateProps,
} from './application/applicationReducer';
import {
  userProfileReducer,
  userProfileStateProps,
} from './userProfile/userProfileReducer';
import { appStateProps, appStateReducer } from './appState/appStateReducer';

export interface masterStore {
  application: applicationStateProps;
  userProfile: userProfileStateProps;
  appState: appStateProps;
}

const rootReducer = combineReducers({
  application: applicationReducer,
  userProfile: userProfileReducer,
  appState: appStateReducer,
});

export default rootReducer;
