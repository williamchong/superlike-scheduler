import { Context } from '@nuxt/types';
import * as api from '../../util/api';
import * as types from './mutation-types';

export async function fetchLinks(this: Context, { commit }) {
  const links = await this.$axios.$get(api.getLinks());
  commit(types.LINK_SET_LINKS, links);
  return links;
}

export async function addNewLink(
  this: Context,
  { commit },
  {
    sourceURL,
    nextId = null,
    prevId = null,
  }: {
    sourceURL: string;
    nextId: string | null;
    prevId: string | null;
  }
) {
  const { id } = await this.$axios.$put(api.getLinks(), {
    sourceURL,
    nextId,
    prevId,
  });
  const payload = {
    id,
    sourceURL,
    nextId,
    prevId,
  };
  commit(types.LINK_ADD_LINK, payload);
  return payload;
}

export async function updateLink(
  this: Context,
  { commit },
  {
    id,
    nextId,
    prevId,
  }: { id: string; nextId: string | null; prevId: string | null }
) {
  await this.$axios.$patch(api.getLinkById(id), {
    nextId,
    prevId,
  });
  commit(types.LINK_UPDATE_LINK, {
    id,
    nextId,
    prevId,
  });
}

export async function deleteLink(
  this: Context,
  { commit },
  { id }: { id: string }
) {
  await this.$axios.$delete(api.getLinkById(id));
  commit(types.LINK_REMOVE_LINK, id);
}
