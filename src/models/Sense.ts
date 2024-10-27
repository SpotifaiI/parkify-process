import knex from 'knex';
import { db } from '../config/db';

export class Sense {
  private db: knex.Knex;

  constructor() {
    this.db = db;
  }
}
