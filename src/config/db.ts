import knex from 'knex';

const knexConfig = require('../../knexfile');
export const db = knex(knexConfig.development);
export const testDb = knex(knexConfig.tests);
