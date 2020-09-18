import { pubsub } from 'firebase-functions';
import { superLikeCron } from '../api/cron/superlike';

module.exports = pubsub.schedule('0 * * * *').onRun(async () => {
  try {
    await superLikeCron();
  } catch (err) {
    console.error(err);
  }
});
