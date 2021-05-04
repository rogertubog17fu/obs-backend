import { BaseModel } from './common/base-model';
import * as yup from 'yup';
import { RelationMappings, Model } from 'objection';
import { UserModel, SystemRoleModel } from '@app/db/models';

export class SystemRole extends BaseModel {
  static tableName = 'system_roles';

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'user_system_roles.userId',
        to: 'users.id',
      },
    },

    systemRole: {
      relation: Model.BelongsToOneRelation,
      modelClass: SystemRoleModel,
      join: {
        from: 'user_system_roles.systemRoleId',
        to: 'system_roles.id',
      },
    },
  };

  static yupSchema = {
    userId: yup.string().required(),

    systemRoleId: yup.string().required(),
  };

  id!: string;
  userId!: string;
  systemRoleId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  user!: UserModel;
  systemRole!: SystemRoleModel;
}
