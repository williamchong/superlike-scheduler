export type LinkData = {
  id: string;
  nextId: string | null;
  prevId: string | null;
};

export type LinkNode = {
  id: string;
  ts: number;
  sourceURL: string;
  nextId: string | null;
  prevId: string | null;
};

export type LinkState = {
  linkMap: { [key: string]: LinkNode };
  orderedLinks: LinkNode[];
};

export const state = (): LinkState => ({
  linkMap: {},
  orderedLinks: [],
});

export default state;
