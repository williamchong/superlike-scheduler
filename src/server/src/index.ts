import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import consola from 'consola';
// @ts-ignore
import { loadNuxt, build } from 'nuxt';

import api from './api';
import { superLikeCron } from './api/cron/superlike';

const app = express();

async function start() {
  const isDev = process.env.NODE_ENV !== 'production';
  // Init Nuxt.js
  const nuxt = await loadNuxt({
    rootDir: path.join(__dirname, '../../'),
    for: isDev ? 'dev' : 'start',
  });

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000,
  } = nuxt.options.server;

  // Enable live build & reloading on dev
  if (isDev) {
    build(nuxt);
  }
  await nuxt.ready();

  app.use(cookieParser());
  app.use('/api', api);
  app.use('/cron', async (_, res) => {
    await superLikeCron();
    res.sendStatus(200);
  });
  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}
start();

export {};
