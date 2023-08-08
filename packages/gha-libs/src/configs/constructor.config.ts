import { EnvVar } from '../decorator';

/**
 * @desc 定数管理
 * @note defaultは必ず設定すること
 */
export class Constructor {
  @EnvVar({
    local: 'http://localhost:22434',
    dev: 'https://dev.alb.anycolorid.com',
    prod: 'https://anycolorid.com',
  })
  public static readonly FRONTEND_URL: string;
}
