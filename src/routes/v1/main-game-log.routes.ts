import * as mainGameController from '../../controllers/main-game-log/main-game-log.controller';
import express from 'express';
import { asyncHandler } from '@app/utils';

const router = express.Router();

router.post('/main-game-log', asyncHandler(mainGameController.postMainGameLog));
router.get('/main-game-log', asyncHandler(mainGameController.getMainGameLog))

export const mainGamesLogRouter = router;
