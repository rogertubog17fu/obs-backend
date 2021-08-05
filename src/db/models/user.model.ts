import { BaseModel } from './common/base-model';
import * as yup from 'yup';
import { RelationMappings, Model } from 'objection';
import { SystemRoleModel } from './system-role.model';
import { UserType } from 'src/core/enums';

export class UserModel extends BaseModel {
  static tableName = 'users';
  static readonly modelName = 'User';

  static relationMappings: RelationMappings = {
    userSystemRoles: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/system-role.model`,
      join: {
        from: 'users.id',
        through: {
          from: 'user_system_roles.userId',
          to: 'user_system_roles.systemRoleId',
        },
        to: 'system_roles.id',
      },
    },
  };

  static yupSchema = {
    type: yup.string().oneOf(Object.values(UserType)),

    email: yup.string().email().required(),

    username: yup.string().email().required(),

    salt: yup.string().required(),

    hash: yup.string().required(),
  };

  id!: string;
  type!: UserType;
  email!: string | null;
  username!: string | null;
  salt!: string | null;
  hash!: string | null;

  userSystemRoles?: SystemRoleModel[];
}
