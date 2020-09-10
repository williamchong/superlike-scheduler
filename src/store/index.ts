import { Context } from '@nuxt/types';
import * as api from '../util/api';
import { AUTH_COOKIE_NAME } from '../constant';
import * as userTypes from './user/mutation-types';

export const actions = {
  async nuxtServerInit(this: Context, { commit }, { req }) {
    try {
      if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
        const userInfo = await this.$axios.$get(api.getLoginStatus());
        commit(`user/${userTypes.USER_SET_USER_INFO}`, userInfo);
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status !== 404) {
          console.error(err); // eslint-disable-line no-console
        }
      }
    }
  },
};

export default { actions };
