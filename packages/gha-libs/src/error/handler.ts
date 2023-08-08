export {}

/**
 * @desc 当アプリケーションのerror handler
 * @note
 * 各処理で対応したい方針を決める
 * - console.logに出力して終わりにしたいのか
 * - エラートラッキングサービスに出力したいのか
 * - error pageに遷移させたいのか
 */
// export const errorHandler = (e: unknown): ALBErrorCode => {
//   let statusCode: number | null = null;
//   let message: string | null = null;

//   /** @desc 開発用におく */
//   !BaseEnv.isProd && console.error(e);
//   // @todo ここでdatadog へlogger出力する
//   if (e instanceof ZodError) {
//     statusCode = PARSE_ERROR.statusCode;
//     message = PARSE_ERROR.message;
//   } else if (axios.isAxiosError(e)) {
//     /** @note アクセストークンが有効期限切れの場合は、トークンをリフレッシュするためerror messageを格納する */
//     if (e.response?.data.error === 'jwt_expired') {
//       message = e.response.data.error;
//     } else if (e.response?.data.error === 'duplicate_email') {
//       /** @note 登録済みメールアドレスの場合は表示するエラーの切り分けのためerror messageを格納する */
//       message = e.response.data.error;
//     } else {
//       /** @workaround axios関連のエラーはコンソールへ出力して終わりだった */
//       console.error(e);
//     }
//   } else if (e instanceof ReCaptchaLoadError) {
//     statusCode = e.statusCode;
//     message = e.message;
//   } else if (e instanceof ReCaptchaVerificationError) {
//     statusCode = e.statusCode;
//     message = e.message;
//   } else if (e instanceof IncorrectError) {
//     statusCode = e.statusCode;
//     message = e.message;
//   } else if (e instanceof NotFoundError) {
//     statusCode = e.statusCode;
//     message = e.message;
//   } else if (e instanceof SnsUnlinkUnavailableError) {
//     statusCode = e.statusCode;
//     message = e.message;
//   } else if (e instanceof UnexpectedError) {
//     statusCode = e.statusCode;
//     message = e.message;
//   } else if (e instanceof Error) {
//     console.error(e);
//   }

//   return {
//     statusCode,
//     message,
//   };
// };
