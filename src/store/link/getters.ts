import { LinkState } from './state';

export const getLinkList = (state: LinkState) => state.orderedLinks;
export const getLinksById = (state: LinkState, id: string) => state.linkMap[id];
