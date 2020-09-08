export const AUTH_COOKIE_NAME = '__session';

export const AUTH_COOKIE_OPTION = {
  maxAge: 2592000000, // 30days
  secure: process.env.NODE_ENV === 'production',
  // sameSite: 'lax',
  httpOnly: true,
};

export const HALF_DAY_IN_S = 43200;
export const ONE_DAY_IN_MS = 86400000;

export const OAUTH_SCOPE_REQUEST = [
  'profile',
  'email',
  'read:like',
  'write:like',
];

export const OAUTH_SCOPE_REQUIRED = [
  'profile',
  'email',
  'read:like',
  'write:like',
];
