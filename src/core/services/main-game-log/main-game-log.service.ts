import { MainGameLogModel } from '@app/db/models'

async function create(form: MainGameLogModel): Promise<MainGameLogModel> {
    return MainGameLogModel.query().insertAndFetch(form);
}

async function getByIds(ids: string[]): Promise<MainGameLogModel[]> {
  return MainGameLogModel.query().findByIds(ids);
}

async function getAll(): Promise<MainGameLogModel[]> {
  return MainGameLogModel.query()
}

async function getFilterBy(totalBetMeron: number, totalBetWala: number, lastcallToClosedGap: number, arenaId: string): Promise<MainGameLogModel> {
  return MainGameLogModel.query().findOne({
    totalBetMeron,
    totalBetWala,
    lastcallToClosedGap,
    arenaId
  })
}


async function isExistByFightNumberArenaId(fightNumber: string, arenaId: string): Promise<boolean> {
  const result = await MainGameLogModel.query().findOne({
    fightNumber,
    arenaId,
  });

  return !!result;
}


export const mainGameLogService = {
    create,
    getByIds,
    isExistByFightNumberArenaId,
    getFilterBy,
    getAll
};
