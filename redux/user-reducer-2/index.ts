import { Reducer } from 'redux';
import { UserAction } from './actions';
import { UserCredential } from 'firebase/auth';
import { Address } from '../components';

export interface Search {
  latest: string[];
  latestCategory: string[];
}

export interface UserState {
  email: string | null;
  mainAddress: Address | null;
  addressList: Map<string, Address>;
  authenticated: boolean;
  credit: UserCredential | null;
  latest: string[];
  latestCategory: string[];
}

const initialState: UserState = {
  email: null,
  mainAddress: null,
  addressList: new Map<string, Address>(),
  authenticated: false,
  credit: null,
  latest: [],
  latestCategory: [],
};

const userReducer: Reducer<UserState, UserAction> = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.payload,
      };
    case 'SET_MAIN_ADDRESS':
      return {
        ...state,
        mainAddress: action.payload,
      };
    case 'ADD_ADDRESS':
      const updatedAdd = new Map(state.addressList);
      updatedAdd.set(action.payload.title, action.payload);
      return {
        ...state,
        addressList: updatedAdd,
        mainAddress: action.payload,
      };
    case 'REMOVE_ADDRESS':
      const updatedDel = new Map(state.addressList);
      updatedDel.delete(action.payload);
      return {
        ...state,
        addressList: updatedDel,
        mainAddress: state.mainAddress?.title === action.payload ? null : state.mainAddress,
      };
    case 'LOGOUT':
      return initialState;
    case 'LOGIN':
      return {
        ...state,
        credit: action.payload,
        authenticated: true,
      };
    case 'GET_UTILS':
      return {
        ...state,
        mainAddress: action.payload.mainAddress,
        addressList: action.payload.addressList,
        email: action.payload.email,
        latest: action.payload.latestList,
        latestCategory: action.payload.latestCategoryList || [],
      };
    case 'SEARCH_DONE':
      const updatedSearch: string[] = [...state.latest, action.payload.searchText];
      let updatedSearch2: string[] = state.latestCategory;
      if (action.payload.isCat) {
        updatedSearch2 = [
          ...state.latestCategory.filter((e) => e !== action.payload.searchText),
          action.payload.searchText,
        ];
      }

      return {
        ...state,
        latest: updatedSearch,
        latestCategory: updatedSearch2,
      };
    default:
      return state;
  }
};

export default userReducer;
