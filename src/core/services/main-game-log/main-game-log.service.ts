import { MainGameLogModel } from '@app/db/models';
import { Maybe } from '@app/graphql-schema-types';
import { OrderByDirection } from 'objection';
import { MainGameLogSortField } from '@app/core/enums';
import { ICursorPaginationResult } from '@app/core/interfaces';

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

interface IMainGameLogCursorPaginatedArgs {
  before?: Maybe<string>;
  after?: Maybe<string>;
  first: number;
  sortDirection: OrderByDirection;
  sortField: MainGameLogSortField;
  search?: Maybe<string>;
}
async function getCursorPaginated(args: IMainGameLogCursorPaginatedArgs): Promise<ICursorPaginationResult<MainGameLogModel>> {

  const { before, after, first, sortDirection, sortField } = args;

  const query = MainGameLogModel.query().orderBy(sortField, sortDirection).limit(first);

  if (args.search) {
    query.orWhere('fightNumber', 'like', `%${args.search}%`);
  }

  if (before) {
    return query.previousCursorPage(before);
  }

  return query.nextCursorPage(after);
}

export const mainGameLogService = {
    create,
    getByIds,
    isExistByFightNumberArenaId,
    getFilterBy,
    getAll,
    getCursorPaginated
};
