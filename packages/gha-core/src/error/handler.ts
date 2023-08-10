import { IncorrectError } from './class';

export const errorHandler = (e: unknown): { message: string | null } => {
  let message: string | null = null;

  // @todo ここでdatadog へlogger出力する
  if (e instanceof IncorrectError) {
    message = e.message;
  } else if (e instanceof Error) {
    console.error(e);
  }

  return {
    message,
  };
};
