import * as yup from 'yup';
import { CashierModel } from '@app/db/models';

const { firstName, lastName } = CashierModel.yupSchema;

export const registerSchema = yup.object({
  input: yup.object({
    firstName,
    lastName,
  }),
});
