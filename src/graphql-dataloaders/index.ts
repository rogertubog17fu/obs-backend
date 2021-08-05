import * as coreServices from '@app/core/services';
import { mainGameLogByIdLoader } from './main-game-log.dataloader';
import { userByIdLoader } from './user-by-id.dataloader';

export const initLoaders = (services: typeof coreServices) => {
  const loaders = {
    mainGameLogById: mainGameLogByIdLoader(services),
    userById: userByIdLoader(services),
  };

  return loaders;
};
