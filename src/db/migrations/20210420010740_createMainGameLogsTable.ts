import * as Knex from 'knex';
import { addTimeStamps } from '../helpers/add-timestamps';

const TABLE_NAME = 'main_game_logs';

export async function up(knex: Knex): Promise<any> {
  const tableExists = await knex.schema.hasTable(TABLE_NAME);

  if (!tableExists) {
    await knex.schema
      .createTable(TABLE_NAME, (t) => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        t.string('fightNumber');
        t.enum('gameStatus', ['Open', 'Closed', 'Finished', 'Reverse', 'Cancel']);
        t.enum('winner', ['Meron', 'Wala', 'Draw', 'Waiting', 'Cancelled']).nullable();
        t.float('payoutMeron');
        t.float('payoutWala');
        t.integer('totalBetMeron');
        t.integer('totalBetWala');
        t.float('lastcallToClosedGap');
        t.float('openTolastcallGap');
        t.float('mainBalancePoints');
        t.uuid('arenaId').notNullable();
        t.integer('betWala');
        t.integer('betMeron');
        t.integer('betDraw');
        t.string('anouncement');

        t.foreign('arenaId').references('arena.id');
      })
      .then(async () => {
        await addTimeStamps(knex, TABLE_NAME);
      });
  }
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists(TABLE_NAME);
}
