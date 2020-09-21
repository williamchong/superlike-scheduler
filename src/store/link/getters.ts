import { LinkState } from './state';

export const getLinkList = (state: LinkState) => state.orderedLinks;
export const getLinksById = (state: LinkState, id: string) => state.linkMap[id];
export const getLinkInfo = (state: LinkState) => (url: string) =>
  state.linkInfoMap[url];
export const getFirstLink = (state: LinkState) => {
  if (!state.orderedLinks.length) return undefined;
  return state.orderedLinks[0];
};
export const getLastLink = (state: LinkState) => {
  if (!state.orderedLinks.length) return undefined;
  return state.orderedLinks[state.orderedLinks.length - 1];
};
