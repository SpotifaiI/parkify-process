import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sense', schema => {
    schema.increments('id').primary().unique().comment('Identificador único da captação do sensor');
    schema.decimal('distance', 8, 4).notNullable().comment('Leitura do sensor de distância');
    schema.decimal('light', 8, 4).notNullable().comment('Leitura do fotorresistor');
    schema.boolean('is_available').notNullable().comment('Indica se a vaga está sendo ocupada ou não conforme a lógica embarcada');
    schema.string('parking_slot').notNullable().comment('indica qual a vaga que está sendo interagida');
    schema.timestamp('created_at').defaultTo(knex.fn.now()).comment('Momento que ocorreu a gravação');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('sense');
}