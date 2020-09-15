import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, linkCollection } from '../util/firebase';
import { setPrivateCacheHeader } from '../middleware/cache';

const router = Router();

router.get('/', async (req, res, next) => {
  if (!req.session?.user) {
    res.sendStatus(401);
    return;
  }
  setPrivateCacheHeader(res);
  try {
    const { user } = req.session;
    const query = await linkCollection
      .where('user', '==', user)
      .orderBy('ts', 'desc')
      .get();
    res.json(query.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  if (!req.session?.user) {
    res.sendStatus(401);
    return;
  }
  setPrivateCacheHeader(res);
  try {
    const { user } = req.session;
    const { sourceURL, nextId, prevId = null } = req.body;
    const id = uuidv4();
    const payload = {
      id,
      user,
      ts: Date.now(),
      sourceURL,
      nextId,
      prevId,
    };
    const batch = db.batch();
    await batch.create(linkCollection.doc(id), payload);
    if (prevId) await batch.update(linkCollection.doc(prevId), { nextId: id });
    await batch.commit();
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  if (!req.session?.user) {
    res.sendStatus(401);
    return;
  }
  const { id } = req.params;
  setPrivateCacheHeader(res);
  try {
    const doc = await linkCollection.doc(id).get();
    const docData = doc.data();
    if (!docData) {
      res.sendStatus(404);
      return;
    }
    const { nextId, prevId } = req.body;
    const { nextId: oldNextId, prevId: oldPrevId } = docData;
    if (nextId === oldNextId && prevId === oldPrevId) {
      res.status(400).send('INVALID_UPDATE');
      return;
    }
    const batch = db.batch();
    if (oldNextId && oldNextId === prevId) {
      batch.update(linkCollection.doc(oldNextId), {
        prevId: oldPrevId,
        nextId: id,
      });
    } else {
      if (oldNextId) {
        batch.update(linkCollection.doc(oldNextId), { prevId: oldPrevId });
      }
      if (prevId) {
        batch.update(linkCollection.doc(prevId), { nextId: id });
      }
    }
    if (oldPrevId && oldPrevId === nextId) {
      batch.update(linkCollection.doc(oldPrevId), {
        nextId: oldNextId,
        prevId: id,
      });
    } else {
      if (oldPrevId) {
        batch.update(linkCollection.doc(oldPrevId), { nextId: oldNextId });
      }
      if (nextId) {
        batch.update(linkCollection.doc(nextId), { prevId: id });
      }
    }
    await batch.commit();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  if (!req.session?.user) {
    res.sendStatus(401);
    return;
  }
  setPrivateCacheHeader(res);
  const { id } = req.params;
  try {
    const doc = await linkCollection.doc(id).get();
    const docData = doc.data();
    if (!docData) {
      res.sendStatus(404);
      return;
    }
    const { nextId, prevId } = docData;
    const batch = db.batch();
    if (nextId) batch.update(linkCollection.doc(nextId), { prevId });
    if (prevId) batch.update(linkCollection.doc(prevId), { nextId });
    batch.delete(linkCollection.doc(id));
    await batch.commit();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

export default router;
