import produce from 'immer';
import * as types from '../types';
import { Roles } from '../../common/auth/roles';

interface User {
  authenticated: boolean;
  currentUser: {
    id: number;
    repos: any[];
    domains: any[];
    avatarUrl: string;
    authRoles: string[];
  } | null;
  isAdmin: boolean;
  isTester: boolean;
}

const initialState: User = {
  authenticated: false,
  currentUser: null,
  isAdmin: false,
  isTester: false,
};

export default function reducer(state: User = initialState, action: any): User {
  return produce(state, (draft) => {
    switch (action.type) {
      case types.LOGIN:
        draft.authenticated = true;
        break;
      case types.CURRENT_USER:
        draft.currentUser = action.payload;
        draft.authenticated = true;
        draft.isAdmin = checkAdmin(action.payload);
        draft.isTester = checkTester(action.payload);
        break;
      case types.LOGOUT:
        draft.currentUser = null;
        draft.authenticated = false;
        break;
      case types.CREATE_REPO:
        draft.currentUser?.repos.push(action.payload);
        break;
      case types.CREATE_DOMAIN:
        draft.currentUser?.domains.push(action.payload);
        break;
      case types.DELETE_REPO:
        draft.currentUser.repos = state.currentUser?.repos.filter((repo) => repo.id !== action.payload) || [];
        break;
      case types.DELETE_DOMAIN:
        draft.currentUser.domains = state.currentUser?.domains.filter((dom) => dom.id !== action.payload) || [];
        break;
      case types.UPDATE_AVATAR:
        if (draft.currentUser) {
          draft.currentUser.avatarUrl = action.payload;
        }
        break;
      default:
    }
  });
}

const checkAdmin = (user: any): boolean => {
  if (user) {
    return user.authRoles.some((role) => role === Roles.Admin);
  } else {
    return false;
  }
};

const checkTester = (user: any): boolean => {
  if (user) {
    return user.authRoles.some((role) => role === Roles.Tester);
  } else {
    return false;
  }
};
