import { db, userCollection, linkCollection } from '../util/firebase';
import {
  apiPostServerSuperLike,
  apiGetServerUserSuperLikeStatus,
} from '../util/api';

export async function superLikeCron() {
  const timeNow = Date.now();
  const query = await linkCollection
    .where('prevId', '==', null)
    .where('publishedTs', '==', 0)
    .where('publishAfter', '<=', timeNow)
    .orderBy('publishAfter')
    .orderBy('ts')
    .get();
  const userMap: { [key: string]: any } = {};
  query.docs.forEach((d) => {
    const { sourceURL, likee, liker, nextId } = d.data();
    if (!userMap[liker]) {
      userMap[liker] = { id: d.id, sourceURL, likee, liker, nextId };
    }
  });
  Object.values(userMap).forEach(async (u) => {
    const { id, sourceURL, likee, liker, nextId } = u;
    try {
      const likerDoc = await userCollection.doc(liker).get();
      const likerData = likerDoc.data();
      if (!likerData) return;
      const { accessToken, refreshToken } = likerData;
      const { data: superLikeData } = await apiGetServerUserSuperLikeStatus({
        accessToken,
        refreshToken,
      });
      const { canSuperLike, nextSuperLikeTs } = superLikeData;
      if (canSuperLike) {
        await apiPostServerSuperLike(
          {
            accessToken,
            refreshToken,
          },
          likee,
          sourceURL
        );
        const batch = db.batch();
        batch.update(linkCollection.doc(id), { publishedTs: Date.now() });
        if (nextId) {
          batch.update(linkCollection.doc(nextId), { prevId: null });
        }
        await batch.commit();
      } else if (nextSuperLikeTs) {
        linkCollection.doc(id).update({ publishAfter: nextSuperLikeTs });
      }
    } catch (err) {
      const msg = (err.response && err.response.data) || err.message || err;
      console.error(`${liker}: ${msg}`); // eslint-disable-line no-console
    }
  });
}

export default superLikeCron;
