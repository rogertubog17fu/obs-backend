import * as mainGameController from '../../controllers/main-game-log/main-game-log.controller';
import express from 'express';
import { asyncHandler } from '@app/utils';

const router = express.Router();

router.post('/main-game-log/6352E357D2FC7C8D16F57538A184BCBC', asyncHandler(mainGameController.postMainGameLog));
router.put('/main-game-log/6352E357D2FC7C8D16F57538A184BCBC', asyncHandler(mainGameController.getMainGameLog))
router.put('/main-game-log-data/6352E357D2FC7C8D16F57538A184BCBC', asyncHandler(mainGameController.getMainGameLogData))

export const mainGamesLogRouter = router;
