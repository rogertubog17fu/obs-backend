import * as Knex from 'knex';
import { bcryptUtil } from '@app/utils';
import { UserModel, SystemRoleModel, AdminModel } from '@app/db/models';
import { PartialModelObject } from 'objection';
import { UserType } from '@app/core/enums';

const USERS_TABLE_NAME = 'users';
const ADMIN_TABLE_NAME = 'admin';
const ROLES_TABLE_NAME = 'system_roles';
const USER_ROLES_TABLE_NAME = 'user_system_roles';

export async function seed(knex: Knex): Promise<any> {
  // Create Super Admin Role
  const superadminRole: PartialModelObject<SystemRoleModel> = {
    // Note:
    // If you plan to change the name of the superadmin role, make sure to change also the value in the SystemRole enum
    name: 'Super Administrator',
    description: 'Admin of all admins',
  };

  const createSuperadminRoleQuery = knex(ROLES_TABLE_NAME).insert([superadminRole]);
  const createSuperadminRoleQueryResult = await knex.raw('? ON CONFLICT DO NOTHING RETURNING id', [createSuperadminRoleQuery]);

  // Create Super Admin User
  const defaultPassword = 'password';
  const salt = await bcryptUtil.generateSalt();
  const hash = await bcryptUtil.generateHash(defaultPassword, salt);
  const user: PartialModelObject<UserModel> = {
    hash,
    salt,
    username: 'superadmin',
    email: 'superadmin@app.com',
    type: UserType.ADMIN,
  };

  const createSuperadminUserQuery = knex(USERS_TABLE_NAME).insert([user]);
  const createSuperadminUserQueryResult = await knex.raw('? ON CONFLICT DO NOTHING RETURNING id', [createSuperadminUserQuery]);

  if (!createSuperadminRoleQueryResult.rowCount || !createSuperadminUserQueryResult.rowCount) {
    // This simply means this has been done before so it's okay to skip.
    return;
  }

  // Otherwise, Associate superadmin role to superadmin user
  const {
    rows: [{ id: superadminRoleId }],
  } = createSuperadminRoleQueryResult;

  const {
    rows: [{ id: superadminUserId }],
  } = createSuperadminUserQueryResult;

  const admin: PartialModelObject<AdminModel> = {
    id: superadminUserId,
    firstName: 'superadmin',
    lastName: 'sa',
  };

  const createAminUserQuery = knex(ADMIN_TABLE_NAME).insert([admin]);
  await knex.raw('? ON CONFLICT DO NOTHING RETURNING id', [createAminUserQuery]);

  const assignRoleToUserQuery = knex(USER_ROLES_TABLE_NAME).insert([
    {
      systemRoleId: superadminRoleId,
      userId: superadminUserId,
    },
  ]);
  await knex.raw('? ON CONFLICT DO NOTHING', [assignRoleToUserQuery]);
}
