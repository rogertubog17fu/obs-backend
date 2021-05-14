import { RequestHandler } from 'express';
import { GameStatus, Winner } from 'src/core/enums';
import { mainGameLogService, arenaService } from 'src/core/services';
import { ArenaModel, MainGameLogModel } from '@app/db/models';
import { Maybe } from '@app/graphql-schema-types';
import { OrderByDirection } from 'objection';
import { MainGameLogSortField, SortDirection } from '@app/core/enums';
import { IPageInfo } from '@app/core/interfaces';

// import fs from 'fs';

// const mainGameLogPath = require('path').resolve(__dirname, '../files/mainGameLogs.txt');

interface IGamePostRequest {
  eventTitle: string;
  fightNumber: string;
  status: GameStatus;
  winner: Winner;
  payoutMeron: number;
  payoutWala: number;
  totalBetMeron: number;
  totalBetWala: number;
  lastcallToClosedGap: number;
  openTolastcallGap: number;
  mainBalancePoints: number;
  betWala: number,
  betMeron: number,
  betDraw: number,
  anouncement: string
}

interface IMainGameLogCursorPaginatedArgs {
  before?: Maybe<string>;
  after?: Maybe<string>;
  first: number;
  sortDirection: OrderByDirection;
  sortField: MainGameLogSortField;
  search?: Maybe<string>;
}

interface IGetMainGameLogResponse {
  nodes: MainGameLogModel[],
  pageInfo: IPageInfo,
  totalCount: number
}

export const getMainGameLog: RequestHandler = async (req, res) => {

  const { before, after, first, sortDirection, sortField, search} = req.body as IMainGameLogCursorPaginatedArgs

  const result = await mainGameLogService.getCursorPaginated({
    before,
    after,
    first: first ?? 25,
    sortDirection: sortDirection ?? SortDirection.ASC,
    sortField: sortField ?? MainGameLogSortField.CREATED_AT,
    search,
  });

  const response: IGetMainGameLogResponse = {
    nodes: result.results.map((x) => x.data),
    pageInfo: result.pageInfo,
    totalCount: result.totalCount,
  };

  res.send(response);
}


export const postMainGameLog: RequestHandler = async (req, res) => {
  console.log(req.body)



    const {
        fightNumber,
        status,
        winner,
        eventTitle,
        payoutMeron,
        payoutWala,
        totalBetMeron,
        totalBetWala,
        lastcallToClosedGap,
        openTolastcallGap,
        mainBalancePoints,
        betWala,
        betMeron,
        betDraw,
        anouncement
    } = req.body as IGamePostRequest

    let newOpenTolastcallGap = openTolastcallGap
    let newLastcallToClosedGap = lastcallToClosedGap

    if (!(await arenaService.isExistByEventTitle(eventTitle))) {
      const arenaForm = new ArenaModel();

      arenaForm.set({
        eventTitle,
      });

      await arenaService.create(arenaForm);
    }

    // checkOpenToCloseGap
    if(openTolastcallGap > 14400) { // 14400 = 4 hours
      newOpenTolastcallGap = 0
    }
    else if(lastcallToClosedGap > 14400) {
      newLastcallToClosedGap = 0
    }

    const arena = await arenaService.getByEventTitle(eventTitle);


    const mainGamelogForm = new MainGameLogModel()

    mainGamelogForm.set({
        fightNumber,
        gameStatus: status,
        arenaId: arena.id,
        winner,
        payoutMeron: payoutMeron ?? 0,
        payoutWala: payoutWala ?? 0,
        totalBetMeron,
        totalBetWala,
        mainBalancePoints,
        lastcallToClosedGap: newLastcallToClosedGap,
        openTolastcallGap: newOpenTolastcallGap,
        betWala,
        betMeron,
        betDraw,
        anouncement
    })

    const queryMainGameLog = await mainGameLogService.getFilterBy(totalBetMeron, totalBetWala, lastcallToClosedGap, arena.id)

    if(!queryMainGameLog || (queryMainGameLog && (queryMainGameLog.fightNumber === fightNumber))) {
      const mainGameLog = await mainGameLogService.create(mainGamelogForm)

      res.send({
        data: mainGameLog,
      });
    } else {
      res.send({
        data: null,
      });
    }

};

// fightNumber: FightNumber,
//         status: BettingStatus,
//         winner: winner
