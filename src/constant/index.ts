export const { IS_TESTNET } = process.env;

export const TEST_MODE =
  process.env.NODE_ENV !== 'production' || process.env.CI;

export const LIKECOIN_API_BASE = IS_TESTNET
  ? 'https://api.rinkeby.like.co'
  : 'https://api.like.co';

export const LIKE_CO_URL_BASE = IS_TESTNET
  ? 'https://rinkeby.like.co'
  : 'https://like.co';

export const SUPERLIKE_HOSTNAME = IS_TESTNET
  ? 's.rinkeby.like.co'
  : 's.like.co';

export const AUTH_COOKIE_NAME = '__session';

export const QUERY_STRING_TO_REMOVE = [
  'fbclid',
  'gclid',
  'gi',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  '__cf_chl_captcha_tk__',
  '__cf_chl_jschl_tk__',
];
