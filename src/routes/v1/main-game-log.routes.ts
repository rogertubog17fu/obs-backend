import * as mainGameController from '../../controllers/main-game-log/main-game-log.controller';
import express from 'express';
import { asyncHandler } from '@app/utils';

const router = express.Router();

router.post('/main-game-log', asyncHandler(mainGameController.postMainGameLog));

export const mainGamesLogRouter = router;
