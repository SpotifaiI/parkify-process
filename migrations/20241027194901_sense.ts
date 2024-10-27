import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sense', schema => {
    schema.increments('id').primary().unique().comment('Identificador único da captação do sensor.');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('sense');
}