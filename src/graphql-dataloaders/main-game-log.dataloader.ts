import { createDataLoader } from '@app/utils';
import * as coreServices from '@app/core/services';

export const mainGameLogByIdLoader = ({ mainGameLogService }: typeof coreServices) => {
  return createDataLoader(async (ids: string[]) => {
    const rows = await mainGameLogService.getByIds(ids);

    return ids.map((id) => rows.find((row) => row.id === id) || null);
  });
};
