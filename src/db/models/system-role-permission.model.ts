import { BaseModel } from './common/base-model';
import * as yup from 'yup';
import { SystemPermissionModel, SystemRoleModel } from '@app/db/models';
import { RelationMappings, Model } from 'objection';

export class SystemRolePermission extends BaseModel {
  static tableName = 'system_role_permissions';
  // static readonly modelName = 'Player';

  static relationMappings: RelationMappings = {
    systemRole: {
      relation: Model.BelongsToOneRelation,
      modelClass: SystemRoleModel,
      join: {
        from: 'system_role_permissions.systemRoleId',
        to: 'system_roles.id',
      },
    },

    systemPermission: {
      relation: Model.BelongsToOneRelation,
      modelClass: SystemPermissionModel,
      join: {
        from: 'system_role_permissions.systemPermissionId',
        to: 'system_permissions.id',
      },
    },
  };

  static yupSchema = {
    systemRoleId: yup.string().required(),

    systemPermissionId: yup.string().required(),
  };

  id!: string;
  systemRoleId!: string;
  systemPermissionId!: string;

  systemRole!: SystemRoleModel;
  systemPermission!: SystemPermissionModel;
}
