import { config } from 'firebase-functions';

export const IS_TESTNET = config().constant.network === 'rinkeby';
if (IS_TESTNET) process.env.IS_TESTNET = 'TRUE';

export const FIRESTORE_USER_ROOT = config().db.firestore_user_root;
export const FIRESTORE_LINK_ROOT = config().db.firestore_link_root;

export const LIKE_CO_CLIENT_ID = config().likeco_oauth.clientid;
export const LIKE_CO_CLIENT_SECRET = config().likeco_oauth.secret;

export const COOKIE_SECRET = config().cookie.secret;

export const EXTERNAL_URL = config().constant.external_url;
