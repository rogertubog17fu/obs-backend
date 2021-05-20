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
  nodes: IResponseNodes[],
  pageInfo: IPageInfo,
  totalCount: number
}

interface Bets {
  createdAt: Date;
  currentTotal: number;
  increaseAmount: number;
  increasePercent: number;
}

interface Odds{
  averageIncreasePerSecond: number;
  accelerationIncrease: number;
  oddsRatio: number;
  estimatedPayoutRatio: number;
  currentPayoutRatio: number;
  total: number;
}

interface IGame {
  gameFightNumber: string;
  winner: Winner;
  meronBets: Bets[]
  walaBets: Bets[]
  odds: {
    meron: Odds
    wala: Odds
  }
}

interface IResponseNodes {
  date: string;
  games: IGame[]
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

  const queryResults = result.results.map((x) => x.data)
  let prevTime = 0

  // meron
  let prevBetMeron = 0
  let meronPrevIncreaseTimePercentage = 0

  let meronAverageIncreasePerSecond = 0
  let meronAverageAccelerationIncrease = 0

  let meronTotalIncreaseTimePercentage = 0
  let meronTotalAccelerationIncrease = 0

  let meronTotalIncreaseTimePercentageCounter = 0
  let meronTotalAccelerationIncreaseCounter = 0

  // wala
  let prevBetWala = 0
  let walaPrevIncreaseTimePercentage = 0

  let walaAverageIncreasePerSecond = 0
  let walaAverageAccelerationIncrease = 0

  let walaTotalIncreaseTimePercentage = 0
  let walaTotalAccelerationIncrease = 0

  let walaTotalIncreaseTimePercentageCounter = 0
  let walaTotalAccelerationIncreaseCounter = 0


  let meronBets: Bets[] = []
  let walaBets: Bets[] = []

  let games: IGame[] = []
  const responseNodes: IResponseNodes[] = []

  let [ firstResult ] = queryResults
  let firstDate = new Date(firstResult.createdAt).toDateString()

  queryResults.forEach( (mainGameLog, index) =>
  {

    const createdAtDate = new Date(mainGameLog.createdAt).toDateString()

    let timeDiffernce = (mainGameLog.createdAt.getTime() - firstResult.createdAt.getTime()) / 1000
    let counter = 1
    let stopper = false
    let finalTotalBetMeron = mainGameLog.totalBetMeron
    let finalTotalBetWala = mainGameLog.totalBetWala
    let winner = Winner.WAITING
    let meronPayout = 0
    let walaPayout = 0

    while(!stopper) {

      if(queryResults[index+counter]) {
        const queryResult = queryResults[index+counter]

        if(queryResults[index+counter].totalBetMeron === 0) {
          finalTotalBetMeron = queryResults[(index+counter) -1].totalBetMeron
        }
        if(queryResult.totalBetWala === 0) {
          finalTotalBetWala = queryResults[(index+counter) -1].totalBetWala
          meronPayout = queryResults[(index+counter) -1].payoutMeron
          walaPayout = queryResults[(index+counter) -1].payoutWala
        }
        if(queryResult.winner !== Winner.WAITING) {
          winner = queryResult.winner
        }

        if(mainGameLog.fightNumber !== queryResults[index+counter].fightNumber) {
          stopper = true
        }
      } else {
        stopper = true
      }

      counter += 1
    }

    if(index+1 < queryResults.length && index-1 > 0) {
      if(mainGameLog.fightNumber === queryResults[index+1].fightNumber && mainGameLog.fightNumber !== queryResults[index-1].fightNumber) {
        prevBetMeron = 0
        prevBetWala = 0

        prevTime = 0
        timeDiffernce = 0
        firstResult = mainGameLog
      }
    }

    const increaseTime = timeDiffernce - prevTime // row (G)
    // meron
    const meronIncreasePercentage = ((mainGameLog.totalBetMeron - prevBetMeron) / finalTotalBetMeron) * 100 // row (F)
    let meronIncreaseTimePercentage = (meronIncreasePercentage / increaseTime) || 0 // row (I)
    let meronAccelerationIncrease = ((meronIncreaseTimePercentage - meronPrevIncreaseTimePercentage) / increaseTime) || 0 // row (L)
    // wala
    const walaIncreasePercentage = ((mainGameLog.totalBetWala - prevBetWala) / finalTotalBetWala) * 100 // row (F)
    let walaIncreaseTimePercentage = (walaIncreasePercentage / increaseTime) || 0 // row (I)
    let walaAccelerationIncrease = ((walaIncreaseTimePercentage - walaPrevIncreaseTimePercentage) / increaseTime) || 0 // row (L)


    // betsMeron #####################
    meronBets.push({
      createdAt: mainGameLog.createdAt,
      currentTotal: mainGameLog.totalBetMeron,
      increaseAmount: Math.round((meronIncreasePercentage / 100) * finalTotalBetMeron / 100) * 100,
      increasePercent: meronIncreasePercentage
    })
    // betsWala #####################
    walaBets.push({
      createdAt: mainGameLog.createdAt,
      currentTotal: mainGameLog.totalBetWala,
      increaseAmount: Math.round((walaIncreasePercentage / 100) * finalTotalBetWala / 100) * 100,
      increasePercent: walaIncreasePercentage
    })


    if(increaseTime === 0) {
      // meron
      meronIncreaseTimePercentage = 0
      meronAccelerationIncrease = 0
      // wala
      walaIncreaseTimePercentage = 0
      walaAccelerationIncrease = 0
    }

    if(index+1 < queryResults.length) {
      if(mainGameLog.fightNumber !== queryResults[index+1].fightNumber) {
        // meron
        meronAverageIncreasePerSecond = ((meronTotalIncreaseTimePercentage / meronTotalIncreaseTimePercentageCounter) / 100) * finalTotalBetMeron
        meronAverageAccelerationIncrease = ((meronTotalAccelerationIncrease/ meronTotalAccelerationIncreaseCounter) / 100) * finalTotalBetMeron

        meronTotalIncreaseTimePercentage = 0
        meronTotalIncreaseTimePercentageCounter = 0

        meronTotalAccelerationIncrease = 0
        meronTotalAccelerationIncreaseCounter = 0
        // wala
        walaAverageIncreasePerSecond = ((walaTotalIncreaseTimePercentage / walaTotalIncreaseTimePercentageCounter) / 100) * finalTotalBetWala
        walaAverageAccelerationIncrease = ((walaTotalAccelerationIncrease/ walaTotalAccelerationIncreaseCounter) / 100) * finalTotalBetWala

        walaTotalIncreaseTimePercentage = 0
        walaTotalIncreaseTimePercentageCounter = 0

        walaTotalAccelerationIncrease = 0
        walaTotalAccelerationIncreaseCounter = 0

        // push game
        const meronOddsRatio = finalTotalBetMeron / (finalTotalBetMeron + finalTotalBetWala)
        const walaOddsRatio = finalTotalBetWala / (finalTotalBetWala + finalTotalBetMeron)

        games.push({
          gameFightNumber: mainGameLog.fightNumber,
          winner,
          meronBets,
          walaBets,
          odds: {
            meron: {
              averageIncreasePerSecond: meronAverageIncreasePerSecond,
              accelerationIncrease: meronAverageAccelerationIncrease,
              oddsRatio: meronOddsRatio,
              estimatedPayoutRatio: 1 + (1 - (meronOddsRatio - (meronOddsRatio/2))),
              currentPayoutRatio: meronPayout,
              total: finalTotalBetMeron
            },
            wala: {
              averageIncreasePerSecond: walaAverageIncreasePerSecond,
              accelerationIncrease: walaAverageAccelerationIncrease,
              oddsRatio: walaOddsRatio,
              estimatedPayoutRatio: 1 + (1 - (walaOddsRatio - (walaOddsRatio/2))),
              currentPayoutRatio: walaPayout,
              total: finalTotalBetMeron
            }
          }
        })
        meronBets  = []
        walaBets = []
        // END
      }
    }

    if(firstDate !== createdAtDate) {

      // push date
      responseNodes.push({
        date: firstDate,
        games
      })

      games = []
      firstDate = createdAtDate
    }

    prevTime = timeDiffernce
    // meron
    meronTotalIncreaseTimePercentage += meronIncreaseTimePercentage
    meronTotalIncreaseTimePercentageCounter += 1

    meronTotalAccelerationIncrease += meronAccelerationIncrease
    meronTotalAccelerationIncreaseCounter += 1

    prevBetMeron = mainGameLog.totalBetMeron
    meronPrevIncreaseTimePercentage = meronIncreaseTimePercentage
    // wala
    walaTotalIncreaseTimePercentage += walaIncreaseTimePercentage
    walaTotalIncreaseTimePercentageCounter += 1

    walaTotalAccelerationIncrease += walaAccelerationIncrease
    walaTotalAccelerationIncreaseCounter += 1

    prevBetWala = mainGameLog.totalBetWala
    walaPrevIncreaseTimePercentage = walaIncreaseTimePercentage
  })

  console.log(responseNodes)


  const response: IGetMainGameLogResponse = {
    nodes: responseNodes,
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