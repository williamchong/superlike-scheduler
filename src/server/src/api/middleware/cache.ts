import { Response } from 'express';

export function setPrivateCacheHeader(res: Response) {
  res.set('Cache-Control', 'private');
  res.set('Vary', 'Cookie');
}

export default setPrivateCacheHeader;
