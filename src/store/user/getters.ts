import { UserState } from './state';

export const getUserInfo = (state: UserState) => state.user;
export const getUserId = (state: UserState) => state.user.user;
export const getUserIsSuperLiker = (state: UserState) =>
  state.user.isSuperLiker;
