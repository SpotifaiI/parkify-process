import dotenv from 'dotenv';
import { app } from './app';
import { db } from './config/db';

(async function start() {
  dotenv.config();

  let isAbleToConnect = false;

  while (!isAbleToConnect) {
    try {
      await db.raw("SELECT 1+1 AS result")

      isAbleToConnect = true;
    } catch (error) {
      isAbleToConnect = false;
    }
  }

  await db.raw('CREATE DATABASE IF NOT EXISTS parkify');
  await db.raw('USE parkify');
  await db.migrate.latest();

  app.listen(3000);
})();
