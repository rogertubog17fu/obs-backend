import { BaseModel } from './common/base-model';
import * as yup from 'yup';

export class ArenaModel extends BaseModel {
  static tableName = 'arena';
  // static readonly modelName = 'Arena';

  static yupSchema = {
    eventTitle: yup.string().nullable(),

    description: yup.string().nullable(),
  };

  id!: string;
  eventTitle!: string;
  description!: string;

  createdAt!: Date;
  updatedAt!: Date;
}
