import { RequestHandler } from 'express';
import { GameStatus, Winner } from 'src/core/enums';
import { mainGameLogService, arenaService } from 'src/core/services';
import { ArenaModel, MainGameLogModel } from '@app/db/models';

// import fs from 'fs';

// const mainGameLog = require('path').resolve(__dirname, '../files/arena.txt');

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



export const postMainGameLog: RequestHandler = async (req, res) => {
  console.log(req.body)

  // const a = await ArenaModel.query()

  // await Promise.all(
  //   a.map(async (b) =>
  //   {
  //     fs.writeFileSync(mainGameLog,`${fs.readFileSync(mainGameLog, 'utf8')}${b.id}*${b.eventTitle}*${b.description}*${b.createdAt}*${b.updatedAt}\r\n`, 'utf8');
  //   })
  // )



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

    if (!(await arenaService.isExistByEventTitle(eventTitle))) {
      const arenaForm = new ArenaModel();

      arenaForm.set({
        eventTitle,
      });

      await arenaService.create(arenaForm);
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
        lastcallToClosedGap,
        openTolastcallGap,
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
