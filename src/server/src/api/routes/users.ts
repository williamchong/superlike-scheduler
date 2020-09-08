import { Router, Request } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { userCollection } from '../util/firebase';
import { setPrivateCacheHeader } from '../middleware/cache';
import {
  apiFetchUserProfile,
  apiFetchUserSuperLikeStatus,
  getOAuthCallbackAPI,
  getOAuthURL,
} from '../util/api';
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTION,
  OAUTH_SCOPE_REQUIRED,
} from '../constant';

const CLEAR_AUTH_COOKIE_OPTION = { ...AUTH_COOKIE_OPTION, maxAge: 0 };

function setSessionOAuthState(req: Request) {
  const state = crypto.randomBytes(8).toString('hex');
  if (req.session) req.session.state = state;
}

const router = Router();

router.get('/self', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session) {
      res.sendStatus(401);
      return;
    }
    const { user } = req.session;
    const { tz = '8' } = req.query;
    if (user) {
      const currentScopes = (jwt.decode(req.session.accessToken) as {
        [key: string]: any;
      }).scope;
      if (
        !OAUTH_SCOPE_REQUIRED.every((s: string) => currentScopes.includes(s))
      ) {
        throw new Error('Insufficient scopes');
      }
      const [{ data }, { data: superLikeData }] = await Promise.all([
        apiFetchUserProfile(req),
        apiFetchUserSuperLikeStatus(req, tz as string),
      ]);
      const { isSuperLiker } = superLikeData;
      res.json({
        user,
        isSuperLiker,
        ...data,
      });
      await userCollection.doc(user).update({
        user: data,
        isSuperLiker,
      });
      return;
    }
    res.sendStatus(401);
  } catch (err) {
    if (req.session) req.session = undefined;
    res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
    next(err);
  }
});

router.get('/login', (req, res) => {
  setSessionOAuthState(req);
  const { from, referrer } = req.query;
  res.redirect(
    getOAuthURL({
      state: req.session?.state,
      isRegister: false,
      from: from as string,
      referrer: referrer as string,
    })
  );
});

router.post('/login', async (req, res, next) => {
  try {
    const { tz = '8' } = req.query;
    if (!req.body.authCode || !req.body.state) {
      res.status(400).send('missing state or authCode');
      return;
    }
    if (req.body.state !== req.session?.state) {
      res.status(400).send('state mismatch');
      return;
    }

    const { data: tokenData } = await axios.post(
      getOAuthCallbackAPI(req.body.authCode)
    );
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
    } = tokenData;

    if (req.session) {
      req.session.accessToken = accessToken;
      req.session.state = undefined;
    }

    const [{ data: userData }, { data: superLikeData }] = await Promise.all([
      apiFetchUserProfile(req),
      apiFetchUserSuperLikeStatus(req, tz as string),
    ]);
    const { user } = userData;
    const { isSuperLiker } = superLikeData;
    if (req.session) req.session.user = user;

    const userDoc = await userCollection.doc(user).get();
    const isNew = !userDoc.exists;

    const payload = {
      user: userData,
      isSuperLiker,
      accessToken,
      refreshToken,
    };
    if (isNew) {
      await userCollection.doc(user).create(payload);
    } else {
      await userCollection.doc(user).update(payload);
    }

    res.json({
      user,
      ...userData,
      isSuperLiker,
      isNew,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session) req.session = undefined;
  res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
  res.sendStatus(200);
});

export default router;
