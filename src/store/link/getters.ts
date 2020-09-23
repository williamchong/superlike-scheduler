import { LinkState, LinkNode } from './state';

function linkMapToArray(links: { [key: string]: LinkNode }) {
  const head = Object.values(links).find((l) => !l.prevId);
  let nextId;
  const output: LinkNode[] = [];
  if (head) {
    output.push(head);
    nextId = head.nextId;
  }
  while (nextId) {
    const current = links[nextId];
    if (!current) break;
    output.push(current);
    nextId = current.nextId;
  }
  return output;
}

export const getLinkList = (state: LinkState) => linkMapToArray(state.linkMap);
export const getLinkInfo = (state: LinkState) => (url: string) =>
  state.linkInfoMap[url];
export const getLinksById = (state: LinkState, id: string) => state.linkMap[id];
export const getFirstLink = (_, getters) => {
  if (!getters.getLinkList) return undefined;
  return getters.getLinkList[0];
};
export const getLastLink = (_, getters) => {
  if (!getters.getLinkList) return undefined;
  return getters.getLinkList[getters.getLinkList.length - 1];
};
