import * as Knex from 'knex';
import { addTimeStamps } from '../helpers/add-timestamps';

const TABLE_NAME = 'users';

export async function up(knex: Knex): Promise<void> {
  const tableExists = await knex.schema.hasTable(TABLE_NAME);

  if (!tableExists) {
    await knex.schema
      .createTable(TABLE_NAME, (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        t.enum('type', ['Player', 'Cashier', 'Operator', 'Admin', 'Manager']);
        t.string('email').unique();
        t.string('username').unique();
        t.string('salt').unique();
        t.string('hash').unique();
      })
      .then(async () => {
        await addTimeStamps(knex, TABLE_NAME);
      });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
