/* eslint-disable no-param-reassign */
// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import { LinkState, LinkNode, LinkData, LinkInfo } from './state';
import {
  LINK_SET_LINKS,
  LINK_ADD_LINK,
  LINK_UPDATE_LINK,
  LINK_REMOVE_LINK,
  LINK_CLEAR_FOR_LOGOUT,
  LINK_SET_LINK_INFO,
} from './mutation-types';

function updateObject(object, id, payload) {
  const oldData = object[id];
  Vue.set(object, id, { ...oldData, ...payload });
}

export default {
  [LINK_SET_LINKS](state: LinkState, links: LinkNode[]) {
    state.linkMap = {};
    links.forEach((l: LinkNode) => {
      Vue.set(state.linkMap, l.id, l);
    });
  },
  [LINK_ADD_LINK](state: LinkState, link: LinkNode) {
    Vue.set(state.linkMap, link.id, link);
    if (link.prevId) {
      updateObject(state.linkMap, link.prevId, { nextId: link.id });
    }
    if (link.nextId) {
      updateObject(state.linkMap, link.nextId, { prevId: link.id });
    }
  },
  [LINK_UPDATE_LINK](state: LinkState, data: LinkData) {
    const { id, nextId, prevId } = data;
    const oldData = state.linkMap[id];
    const { prevId: oldPrevId, nextId: oldNextId } = oldData;
    if (oldNextId) {
      updateObject(state.linkMap, oldNextId, { prevId: oldPrevId });
    }
    if (prevId) updateObject(state.linkMap, prevId, { nextId: id });
    if (oldPrevId) {
      updateObject(state.linkMap, oldPrevId, { nextId: oldNextId });
    }
    if (nextId) updateObject(state.linkMap, nextId, { prevId: id });
    updateObject(state.linkMap, data.id, data);
  },
  [LINK_REMOVE_LINK](state: LinkState, id: string) {
    const { nextId, prevId } = state.linkMap[id];
    if (prevId) {
      updateObject(state.linkMap, prevId, { nextId });
    }
    if (nextId) {
      updateObject(state.linkMap, nextId, { prevId });
    }
    Vue.delete(state.linkMap, id);
  },
  [LINK_CLEAR_FOR_LOGOUT](state: LinkState) {
    state.linkMap = {};
  },
  [LINK_SET_LINK_INFO](
    state: LinkState,
    { url, data }: { url: string; data: LinkInfo }
  ) {
    Vue.set(state.linkInfoMap, url, data);
  },
};
