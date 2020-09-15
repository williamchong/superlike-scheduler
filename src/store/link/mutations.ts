/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import { LinkState, LinkNode, LinkData } from './state';
import {
  LINK_SET_LINKS,
  LINK_ADD_LINK,
  LINK_UPDATE_LINK,
  LINK_REMOVE_LINK,
  LINK_CLEAR_FOR_LOGOUT,
} from './mutation-types';

function linkMapToArray(links: { [key: string]: LinkNode }) {
  const head = Object.values(links).find((l) => !l.prevId);
  let next;
  const output: LinkNode[] = [];
  if (head) {
    output.push(head);
    next = head.nextId;
  }
  while (next) {
    const current = links[next];
    if (!current) break;
    output.push(current);
    next = current.nextId;
  }
  return output;
}

export default {
  [LINK_SET_LINKS](state: LinkState, links: LinkNode[]) {
    state.linkMap = {};
    links.forEach((l: LinkNode) => {
      Vue.set(state.linkMap, l.id, l);
    });
    state.orderedLinks = linkMapToArray(state.linkMap);
  },
  [LINK_ADD_LINK](state: LinkState, link: LinkNode) {
    Vue.set(state.linkMap, link.id, link);
    state.orderedLinks.push(link);
  },
  [LINK_UPDATE_LINK](state: LinkState, data: LinkData) {
    const oldData = state.linkMap[data.id];
    Vue.set(state.linkMap, data.id, { ...oldData, ...data });
    state.orderedLinks = linkMapToArray(state.linkMap);
  },
  [LINK_REMOVE_LINK](state: LinkState, id: string) {
    Vue.delete(state.linkMap, id);
    state.orderedLinks = linkMapToArray(state.linkMap);
  },
  [LINK_CLEAR_FOR_LOGOUT](state: LinkState) {
    state.linkMap = {};
    state.orderedLinks = [];
  },
};
