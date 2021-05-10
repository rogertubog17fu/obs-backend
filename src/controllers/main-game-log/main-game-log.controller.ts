import { RequestHandler } from 'express';
import { GameStatus, Winner } from 'src/core/enums';
import { mainGameLogService, arenaService } from 'src/core/services';
import { ArenaModel, MainGameLogModel } from '@app/db/models';

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

export const getMainGameLog: RequestHandler = async (req, res) => {
  // const mainGameLog = await mainGameLogService.getAll()

  const mainGameLogs = await mainGameLogService.getAll()
  const resMainGameLogs: IGamePostRequest[] = []

  // fs.writeFileSync(mainGameLogPath, '', 'utf8');

  await Promise.all(
    mainGameLogs.map(async (log) =>
    {
      const arena = await arenaService.getById(log.arenaId)
      resMainGameLogs.push({
        eventTitle: arena.eventTitle,
        fightNumber: log.fightNumber,
        status: log.gameStatus,
        winner: log.winner,
        payoutMeron: log.payoutMeron,
        payoutWala: log.payoutWala,
        totalBetMeron: log.totalBetMeron,
        totalBetWala: log.totalBetWala,
        lastcallToClosedGap: log.lastcallToClosedGap,
        openTolastcallGap: log.openTolastcallGap,
        mainBalancePoints: log.mainBalancePoints,
        betWala: log.betWala,
        betMeron: log.betMeron,
        betDraw: log.betDraw,
        anouncement: log.anouncement
      })
      // fs.writeFileSync(mainGameLogPath,`${fs.readFileSync(mainGameLogPath, 'utf8')}${arena.eventTitle}*${log.fightNumber}*${log.gameStatus}*${log.winner}*${log.payoutMeron}*${log.payoutWala}*${log.totalBetMeron}*${log.totalBetWala}*${log.lastcallToClosedGap}*${log.openTolastcallGap}*${log.mainBalancePoints}*${log.betMeron}*${log.betWala}*${log.betDraw}*${log.anouncement}\r\n`, 'utf8');
    })
  )
  res.send(resMainGameLogs);
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
