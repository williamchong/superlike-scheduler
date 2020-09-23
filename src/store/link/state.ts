export type LinkData = {
  id: string;
  nextId: string | null;
  prevId: string | null;
};

export type LinkNode = {
  id: string;
  ts: number;
  likee: string;
  sourceURL: string;
  parentSuperLikeId?: string;
  nextId: string | null;
  prevId: string | null;
};

export type LinkInfo = {
  description: string;
  image: string;
  title: string;
  user: string;
};

export type LinkState = {
  linkMap: { [key: string]: LinkNode };
  orderedLinks: LinkNode[];
  linkInfoMap: { [key: string]: LinkInfo };
};

export const state = (): LinkState => ({
  linkMap: {},
  orderedLinks: [],
  linkInfoMap: {},
});

export default state;
