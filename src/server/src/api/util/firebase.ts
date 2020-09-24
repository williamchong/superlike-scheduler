import { initializeApp, credential, firestore } from 'firebase-admin';
import { FIRESTORE_USER_ROOT, FIRESTORE_LINK_ROOT } from '../../config/config';

let database: firestore.Firestore;
if (!process.env.CI) {
  if (process.env.FIREBASE_CONFIG) {
    initializeApp();
  } else {
    /* eslint-disable-next-line global-require */
    const serviceAccount = require('../../config/serviceAccountKey.json');
    initializeApp({
      credential: credential.cert(serviceAccount),
    });
  }
  database = firestore();
  database.settings({ timestampsInSnapshots: true });
} else {
  database = ({ collection: () => ({}) } as unknown) as firestore.Firestore;
}
export const db = database;
export const { FieldValue } = firestore;

const getCollectionIfDefined = (
  root: string | undefined
): firestore.CollectionReference => {
  if (!root) throw new Error('UNDEFINED_FIRESTORE_PATH');
  const collection = database?.collection(root);
  if (!collection) throw new Error('FIRESTORE_PATH_NOT_FOUND');
  return collection;
};

export const userCollection = getCollectionIfDefined(FIRESTORE_USER_ROOT);
export const linkCollection = getCollectionIfDefined(FIRESTORE_LINK_ROOT);
