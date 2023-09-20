import { createStore, applyMiddleware, combineReducers, Middleware } from 'redux';
import { produce } from 'immer';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';

import user, { UserState } from './user/reducer';
import sets, { SetsState } from './sets/reducer';

// Define your application state
interface AppState {
  user: UserState;
  sets: SetsState;
}

// Middleware for Redux
const bindMiddleware = (middleware: Middleware[]) => {
  return applyMiddleware(...middleware);
};

// Combined reducer for your application state
const combinedReducer = combineReducers<AppState>({
  user,
  sets,
});

// Root reducer with support for HYDRATE action
const reducer = (state: AppState, action: any) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

// Initialize the Redux store
const initStore = () => {
  return createStore(reducer, bindMiddleware([thunkMiddleware as ThunkMiddleware]));
};

// Create a Redux wrapper for Next.js
export const wrapper = createWrapper(initStore);
