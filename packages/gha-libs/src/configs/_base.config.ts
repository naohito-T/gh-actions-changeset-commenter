export const ApplicationStage = {
  local: 'local',
  dev: 'dev',
  prod: 'prod',
} as const;

export type ApplicationStageType = keyof typeof ApplicationStage;

/**
 * @desc アプリケーションに`process.env.STAGE`がセットされていることを確認する
 */
export class BaseEnv {
  public static get isProd(): boolean {
    return this.stage === ApplicationStage.prod;
  }

  public static get isDev(): boolean {
    return this.stage === ApplicationStage.dev;
  }

  public static get isLocal(): boolean {
    return this.stage === ApplicationStage.local;
  }

  public static get stage(): ApplicationStageType {
    const STAGE = process.env.NEXT_PUBLIC_STAGE;

    if (STAGE === undefined) {
      throw new Error(`process.env.NEXT_PUBLIC_STAGE undefined`);
    } else if (!Object.values(ApplicationStage).some((value) => STAGE === value)) {
      throw new Error(`process.env.NEXT_PUBLIC_STAGE is invalid. Set to local, dev, or prod.`);
    }

    return STAGE as ApplicationStageType;
  }
}
