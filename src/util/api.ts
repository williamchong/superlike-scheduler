export const getOAuthRegisterAPI = (from = '', referrer = '') =>
  `/api/users/register?from=${from}&referrer=${encodeURIComponent(referrer)}`;
export const getOAuthLoginAPI = () => '/api/users/login';
export const getOAuthCallbackAPI = () => `/api/users/login`;
export const getLoginStatus = () => `/api/users/self`;
export const getLogoutAPI = () => `/api/users/logout`;