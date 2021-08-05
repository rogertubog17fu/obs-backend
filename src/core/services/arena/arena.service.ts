import { ArenaModel } from '@app/db/models';

async function getById(id: string): Promise<ArenaModel> {
  return ArenaModel.query().findById(id);
}

async function getByIds(ids: string[]): Promise<ArenaModel[]> {
  return ArenaModel.query().findByIds(ids);
}

async function create(form: ArenaModel): Promise<ArenaModel> {
  return ArenaModel.query().insertAndFetch(form);
}

async function updateById(id: string, form: ArenaModel): Promise<ArenaModel> {
  return ArenaModel.query().updateAndFetchById(id, form);
}

async function getByEventTitle(title: string): Promise<ArenaModel> {
  return ArenaModel.query().findOne({
    eventTitle: title,
  });
}

async function isExistByEventTitle(title: string): Promise<boolean> {
  const [result] = await ArenaModel.query()
    .where({
      eventTitle: title,
    })
    .select('id')
    .limit(1);

  return !!result;
}

async function isExistById(id: string): Promise<boolean> {
  const result = await ArenaModel.query().findById(id).select('id');

  return !!result;
}

export const arenaService = {
  getById,
  getByIds,
  create,
  updateById,
  isExistById,
  isExistByEventTitle,
  getByEventTitle,
};
