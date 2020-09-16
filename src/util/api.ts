import { LIKECOIN_API_BASE } from '@/constant';

export const getOAuthRegisterAPI = (from = '', referrer = '') =>
  `/api/users/register?from=${from}&referrer=${encodeURIComponent(referrer)}`;
export const getOAuthLoginAPI = () => '/api/users/login';
export const getOAuthCallbackAPI = () => `/api/users/login`;
export const getLoginStatus = () => `/api/users/self`;
export const getLogoutAPI = () => `/api/users/logout`;
export const getLinks = () => `/api/links`;
export const getLinkInfo = (url) =>
  `${LIKECOIN_API_BASE}/like/info?url=${encodeURIComponent(url)}`;
export const getLinkById = (id) => `/api/links/${id}`;
