import { BaseModel } from './common/base-model';
import * as yup from 'yup';

export class SystemPermissionModel extends BaseModel {
  static tableName = 'system_permissions';

  static yupSchema = {
    name: yup.string().required(),

    action: yup.string().required(),

    subject: yup.string().required(),
  };

  id!: string;
  action!: string;
  subject!: string;
  condition!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
