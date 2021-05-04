import { BaseModel } from './common/base-model';
import * as yup from 'yup';
import { GameStatus, Winner } from 'src/core/enums';
import { ArenaModel } from '@app/db/models';
import { RelationMappings, Model } from 'objection';

export class MainGameLogModel extends BaseModel {
  static tableName = 'main_game_logs';

  static relationMappings: RelationMappings = {
    arena: {
      relation: Model.BelongsToOneRelation,
      modelClass: ArenaModel,
      join: {
        from: 'main_game_logs.arenaId',
        to: 'arena.id',
      },
    },
  };

  static yupSchema = {
    arenaId: yup.string().required(),

    fightNumber: yup.string(),

    gameStatus: yup.string().oneOf(Object.values(GameStatus)),

    winner: yup.string().oneOf(Object.values(Winner)).nullable(),

    payoutMeron: yup.number(),

    payoutWala: yup.number(),

    totalBetMeron: yup.number(),

    totalBetWala: yup.number(),

    lastcallToClosedGap: yup.number(),

    openTolastcallGap: yup.number(),

    mainBalancePoints: yup.number(),

    betWala: yup.number(),

    betMeron: yup.number(),

    betDraw: yup.number(),

    anouncement: yup.string(),
  };

    id!: string;
    arenaId!: string;
    fightNumber!: string;
    gameStatus!: GameStatus;
    winner!: Winner;
    payoutMeron!: number;
    payoutWala!: number;
    totalBetMeron!: number;
    totalBetWala!: number;
    lastcallToClosedGap!: number;
    openTolastcallGap!: number;
    mainBalancePoints!: number;
    betWala!: number;
    betMeron!: number;
    betDraw!: number;
    anouncement!: string;

    createdAt!: Date;
    updatedAt!: Date;
}
