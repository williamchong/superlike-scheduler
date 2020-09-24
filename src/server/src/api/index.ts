import { Router, NextFunction, Response } from 'express';
import crypto from 'crypto';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import FirestoreStoreLib from 'firestore-store';
import { db } from './util/firebase';
import { COOKIE_SECRET } from '../config/config';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTION } from './constant';

import users from './routes/users';
import links from './routes/links';

const router = Router();

const cookieSecret =
  COOKIE_SECRET ||
  (process.env.NODE_ENV === 'production'
    ? crypto.randomBytes(16).toString('base64')
    : 'likecoin');

const FirestoreStore = FirestoreStoreLib(session);
/* Do not store JSON as string */
const store = new FirestoreStore({
  database: db,
  parser: {
    read: (doc: any) => doc.session,
    save: (doc: any) => {
      const data = JSON.parse(JSON.stringify(doc)); // clear object classes
      return {
        session: data,
        dateModified: Date.now(),
      };
    },
  },
});
store.touch = undefined; // hack to disable touch

router.use(bodyParser.json());
router.use(
  session({
    store,
    name: AUTH_COOKIE_NAME,
    secret: cookieSecret,
    cookie: AUTH_COOKIE_OPTION,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
  })
);

router.use((req, _, next) => {
  // HACK: mitigate issue that express-session set-cookie Expires contains comma
  // which makes firebase hosting wrongly split the set-cookie header into 2
  // mitigate by overide cookie serialize function and use MaxAge instead of Expires
  if (req.session) {
    Object.defineProperty(req.session.cookie, 'data', {
      get() {
        return {
          originalMaxAge: this.originalMaxAge,
          maxAge: this.maxAge / 1000,
          secure: this.secure,
          httpOnly: this.httpOnly,
          domain: this.domain,
          path: this.path,
          sameSite: this.sameSite,
        };
      },
    });
  }
  next();
});

router.use(cookieParser());
router.use('/users', users);
router.use('/links', links);

router.get('/healthz', (_, res) => {
  res.sendStatus(200);
});

router.use((err: any, _: any, res: Response, next: NextFunction) => {
  const msg = (err.response && err.response.data) || err.message || err;
  console.error(msg); // eslint-disable-line no-console
  if (res.headersSent) {
    return next(err);
  }
  return res.sendStatus(500);
});

export default router;
