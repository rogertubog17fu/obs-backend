import { UserModel } from '@app/db/models'

async function getById(id: string): Promise<UserModel> {
  return UserModel.query().findById(id);
}

async function getByIds(ids: string[]): Promise<UserModel[]> {
    return UserModel.query().findByIds(ids);
  }

export const userService = {
    getById,
    getByIds
};