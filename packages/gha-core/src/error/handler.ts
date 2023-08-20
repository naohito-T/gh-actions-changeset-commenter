import { IncorrectError } from './class';

export const errorHandler = (e: unknown): { message: string } => {
  let message: string = '';

  // @todo ここでdatadog へlogger出力する
  if (e instanceof IncorrectError) {
    message = e.message;
  } else if (e instanceof Error) {
    message = e.message;
  }

  return {
    message,
  };
};
