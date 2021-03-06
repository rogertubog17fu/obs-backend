import { BaseModel } from './common/base-model';
import * as yup from 'yup';
import { RelationMappings, Model } from 'objection';
import { UserModel } from './user.model';
import { SystemPermissionModel } from './system-permission.model';

export class SystemRoleModel extends BaseModel {
  static tableName = 'system_roles';

  static relationMappings: RelationMappings = {
    systemPermissions: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/system-role-permission.model`,
      join: {
        from: 'system_roles.id',
        through: {
          from: 'user_system_roles.roleId',
          to: 'user_system_roles.systemPermissionId',
        },
        to: 'system_permissions.id',
      },
    },

    users: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/user.model`,
      join: {
        from: 'system_roles.id',
        through: {
          from: 'user_system_roles.roleId',
          to: 'user_system_roles.userId',
        },
        to: 'users.id',
      },
    },
  };

  static yupSchema = {
    name: yup.string().required(),

    description: yup.string().required(),
  };

  id!: string;
  name!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;

  users!: UserModel[];
  systemPermissions!: SystemPermissionModel[];
}
