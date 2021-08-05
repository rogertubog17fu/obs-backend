import * as Knex from 'knex';
import { addTimeStamps } from '../helpers/add-timestamps';

const TABLE_NAME = 'user_system_roles';

export async function up(knex: Knex): Promise<any> {
  const tableExists = await knex.schema.hasTable(TABLE_NAME);

  if (!tableExists) {
    await knex.schema
      .createTable(TABLE_NAME, (t) => {
        t.uuid('systemRoleId').notNullable();
        t.uuid('userId').notNullable();

        t.foreign('systemRoleId').references('system_roles.id');
        t.foreign('userId').references('users.id');

        t.unique(['systemRoleId', 'userId']);
      })
      .then(async () => {
        await addTimeStamps(knex, TABLE_NAME);
      });
  }
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
