import { Context } from '@nuxt/types';
import * as api from '../../util/api';
import * as types from './mutation-types';
import * as linkTypes from '../link/mutation-types';

export async function postLoginToken(
  this: Context,
  { commit, dispatch },
  { authCode, state }
) {
  const user = await this.$axios.$post(api.getOAuthCallbackAPI(), {
    authCode,
    state,
  });
  commit(types.USER_SET_USER_INFO, user);
  // if (user && user.locale) {
  //   dispatch('setLocale', user.locale);
  // }
  return user;
}

export async function fetchLoginStatus(this: Context, { commit, dispatch }) {
  try {
    const user = await this.$axios.$get(api.getLoginStatus());
    commit(types.USER_SET_USER_INFO, user);
    if (user && user.locale) {
      dispatch('setLocale', user.locale);
    }
    return user;
  } catch (err) {
    return false;
  }
}

export async function userLogout(this: Context, { commit }) {
  await this.$axios.$post(api.getLogoutAPI());
  commit(types.USER_SET_USER_INFO, {});
  commit(`link/${linkTypes.LINK_CLEAR_FOR_LOGOUT}`, null, { root: true });
}
