import { Agent } from 'http';
import { Agent as _Agent } from 'https';
import Axios from 'axios';
import { stringify } from 'querystring';
import { Request } from 'express';
import {
  IS_TESTNET,
  EXTERNAL_URL as CONFIG_EXTERNAL_URL,
  LIKE_CO_CLIENT_ID,
  LIKE_CO_CLIENT_SECRET,
} from '../../config/config';
import { userCollection } from './firebase';
import { OAUTH_SCOPE_REQUEST } from '../constant';

const LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';
const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';
export const EXTERNAL_URL =
  CONFIG_EXTERNAL_URL || 'https://superlike-scheduler.web.app';
const OAUTH_REDIRECT_URI = `${EXTERNAL_URL}/oauth/redirect`;

const axios = Axios.create({
  timeout: 60000,
  httpAgent: new Agent({ keepAlive: true }),
  httpsAgent: new _Agent({ keepAlive: true }),
});

async function sendAuthorizedRequestByToken(
  accessToken: string,
  refreshToken: string,
  callback: Function
) {
  let Authorization = `Bearer ${accessToken}`;
  try {
    const res = await callback(Authorization);
    return res;
  } catch (err) {
    if (!err.response || err.response.status !== 401) {
      throw err;
    }
    const { data } = await apiRefreshToken(refreshToken);
    if (!data.access_token) throw new Error('no access_token in reply');
    const newAccessToken = data.access_token;
    Authorization = `Bearer ${newAccessToken}`;
    return callback(Authorization);
  }
}

const apiRefreshAccessToken = async (req: Request) => {
  if (!req.session) return false;
  const { user } = req.session;
  const userDoc = await userCollection.doc(user).get();
  const userData = userDoc.data();
  if (!userData || !userData.refreshToken) {
    req.session = undefined;
    return false;
  }
  try {
    const { data } = await apiRefreshToken(userData.refreshToken);
    if (!data.access_token) throw new Error('no access_token in reply');
    req.session.accessToken = data.access_token;
    return true;
  } catch (err) {
    const msg = (err.response && err.response.data) || err.message || err;
    console.error(msg); // eslint-disable-line no-console
    req.session = undefined;
    return false;
  }
};

async function sendAuthorizedRequest(req: Request, callback: Function) {
  if (!req.session) throw new Error('MISSING_SESSION');
  let Authorization = `Bearer ${req.session.accessToken}`;
  try {
    const res = await callback(Authorization);
    return res;
  } catch (err) {
    if (!err.response || err.response.status !== 401) {
      throw err;
    }
    if (await apiRefreshAccessToken(req)) {
      Authorization = `Bearer ${req.session.accessToken}`;
      return callback(Authorization);
    }
    throw err;
  }
}

const apiRefreshToken = (refreshToken: string) =>
  axios.post(
    `${LIKECOIN_API_BASE}/oauth/access_token?client_id=${LIKE_CO_CLIENT_ID}&client_secret=${LIKE_CO_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`
  );
export const apiFetchUserProfile = (req: Request) =>
  sendAuthorizedRequest(req, (Authorization: string) =>
    axios.get(`${LIKECOIN_API_BASE}/users/profile`, {
      headers: { Authorization },
    })
  );
export const apiFetchUserSuperLikeStatus = (req: Request, tz = '8') =>
  sendAuthorizedRequest(req, (Authorization: string) =>
    axios.get(`${LIKECOIN_API_BASE}/like/share/self?tz=${tz}`, {
      headers: { Authorization },
    })
  );

export const apiGetServerUserSuperLikeStatus = (
  {
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  },
  tz = '8'
) =>
  sendAuthorizedRequestByToken(
    accessToken,
    refreshToken,
    (Authorization: string) =>
      axios.get(`${LIKECOIN_API_BASE}/like/share/self?tz=${tz}`, {
        headers: { Authorization },
      })
  );

export const apiPostServerSuperLike = (
  {
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  },
  likee: string,
  url: string,
  tz = '8'
) =>
  sendAuthorizedRequestByToken(
    accessToken,
    refreshToken,
    (Authorization: string) =>
      axios.post(
        `${LIKECOIN_API_BASE}/like/share/${likee}/?tz=${tz}&referrer=${encodeURIComponent(
          url
        )}`,
        {},
        {
          headers: { Authorization },
        }
      )
  );

export const getOAuthURL = ({
  state,
  isRegister,
  from,
  referrer,
}: {
  state?: string;
  isRegister?: boolean;
  from?: string;
  referrer?: string;
}) => {
  if (!LIKE_CO_CLIENT_ID) throw new Error('CLIENT_ID_NOT_SET');
  /* eslint-disable camelcase */
  const qsPayload: {
    client_id: string;
    redirect_uri: string;
    scope: string;
    state?: string;
    from?: string;
    referrer?: string;
    register?: string;
  } = {
    client_id: LIKE_CO_CLIENT_ID,
    redirect_uri: OAUTH_REDIRECT_URI,
    scope: OAUTH_SCOPE_REQUEST.join(' '),
  };
  /* eslint-enable camelcase */
  if (state) qsPayload.state = state;
  if (from) qsPayload.from = from;
  if (referrer) qsPayload.referrer = referrer;
  if (isRegister) qsPayload.register = '1';
  return `${LIKE_CO_URL_BASE}/in/oauth?${stringify(qsPayload)}`;
};

export const getOAuthCallbackAPI = (authCode: string) => {
  const qsPayload = {
    client_id: LIKE_CO_CLIENT_ID,
    client_secret: LIKE_CO_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: OAUTH_REDIRECT_URI,
    code: authCode,
  };
  return `${LIKECOIN_API_BASE}/oauth/access_token?${stringify(qsPayload)}`;
};
