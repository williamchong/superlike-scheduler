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
      .where('liker', '==', user)
      .where('publishedTs', '==', 0)
      .orderBy('ts', 'desc')
      .get();
    res.json(query.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  if (!req.session?.user) {
    res.sendStatus(401);
    return;
  }
  setPrivateCacheHeader(res);
  try {
    const { user } = req.session;
    const {
      sourceURL,
      likee,
      parentSuperLikeId = null,
      nextId = null,
      prevId = null,
    } = req.body;
    if (!likee) {
      res.status(400).send('MISSING_LIKEE');
      return;
    }
    if (!sourceURL) {
      res.status(400).send('MISSING_URL');
      return;
    }
    const id = uuidv4();
    const payload = {
      id,
      liker: user,
      likee,
      ts: Date.now(),
      publishedTs: 0,
      publishAfter: 0,
      sourceURL,
      nextId,
      prevId,
      parentSuperLikeId,
    };
    const batch = db.batch();
    batch.create(linkCollection.doc(id), payload);
    if (nextId) batch.update(linkCollection.doc(nextId), { prevId: id });
    if (prevId) batch.update(linkCollection.doc(prevId), { nextId: id });
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
    batch.update(linkCollection.doc(id), { nextId, prevId });
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
