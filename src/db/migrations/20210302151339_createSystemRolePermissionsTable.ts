import * as Knex from 'knex';

const TABLE_NAME = 'system_role_permissions';

export async function up(knex: Knex): Promise<any> {
  const tableExists = await knex.schema.hasTable(TABLE_NAME);
  if (!tableExists) {
    await knex.schema.createTable(TABLE_NAME, (t) => {
      t.uuid('systemRoleId').notNullable();
      t.uuid('systemPermissionId').notNullable();

      t.foreign('systemRoleId').references('system_roles.id');
      t.foreign('systemPermissionId').references('system_permissions.id');

      t.unique(['systemRoleId', 'systemPermissionId']);
    });
  }
}
export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
