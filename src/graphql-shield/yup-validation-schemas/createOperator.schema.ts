import { OperatorModel } from 'src/db/models';
import * as yup from 'yup';

const { firstName, lastName } = OperatorModel.yupSchema;

export const createOperatorSchema = yup.object({
  input: yup.object({
    firstName,
    lastName,
    password: yup.string().min(8).max(32),
    email: yup.string().email().required(),
    username: yup.string().email().required(),
  }),
});
