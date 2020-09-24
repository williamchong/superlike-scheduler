/* eslint-disable no-param-reassign */
import { UserState } from './state';
import { USER_SET_USER_INFO, USER_UPDATE_USER_INFO } from './mutation-types';

export default {
  [USER_SET_USER_INFO](state: UserState, user) {
    state.user = user;
  },
  [USER_UPDATE_USER_INFO](state: UserState, userUpdate) {
    state.user = { ...state.user, ...userUpdate };
  },
};