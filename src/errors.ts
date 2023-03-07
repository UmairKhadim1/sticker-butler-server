// import express from 'express';
// import mongoose from 'mongoose';
// import _ from 'lodash';
// import multer from 'multer';

// // Preferred way is to throw a HttpError
// class HttpError extends Error {
//   code: number;
//   message: string;
//   error?: any;

//   constructor(code, message, error?) {
//     super(message);
//     this.code = code;
//     this.error = error;
//   }
// }

// export class NotFoundError extends HttpError {
//   constructor(message?, error?) {
//     super(404, message, error);
//   }
// }

// export class BadRequestError extends HttpError {
//   constructor(message?, error?) {
//     super(400, message, error);
//   }
// }

// export class UnauthorizedError extends HttpError {
//   constructor(message?, error?) {
//     super(403, message, error);
//   }
// }

// export class ConflictError extends HttpError {
//   constructor(message?, error?) {
//     super(409, message, error);
//   }
// }

// export class UnprocessableError extends HttpError {
//   constructor(message?, error?) {
//     super(422, message, error);
//   }
// }

// export class ServerError extends HttpError {
//   constructor(message?, error?) {
//     super(500, message, error);
//   }
// }

// // TODO ignore these in production because it's not all that important
// export class NotificationError extends ServerError {}

// interface ExpressValidatorError {
//   location: string;
//   msg: string;
//   param: string;
// }

// type ErrorLike =
//   | Object
//   | mongoose.Error.ValidatorError
//   | ExpressValidatorError
//   | multer.MulterError;

// interface ErrorResponse {
//   code: number;
//   msg: string;
//   errors?: Array<ErrorLike>;
//   error?: ErrorLike;
// }

// // Sort of deprecated interface that is used behind the screens. Don't use these
// class HttpErrorHandler {
//   code: number;
//   defaultMessage: string;

//   constructor(code: number, defaultMessage: string) {
//     this.code = code;
//     this.defaultMessage = defaultMessage;
//   }

//   send(
//     res: express.Response,
//     msg?: string,
//     errorOrErrors?: Array<ErrorLike> | ErrorLike,
//   ) {
//     let response: ErrorResponse = {
//       code: this.code,
//       msg: msg || this.defaultMessage,
//     };
//     // Array of validator errors
//     if (
//       errorOrErrors &&
//       _.isArray(errorOrErrors) &&
//       errorOrErrors[0] instanceof mongoose.Error.ValidatorError
//     ) {
//       response.errors = errorOrErrors.map(
//         (err: mongoose.Error.ValidatorError) => {
//           return err.properties;
//         },
//       );
//     } else if (_.isArray(errorOrErrors)) {
//       // Not a validator error
//       response.errors = errorOrErrors;
//     } else if (_.isObject(errorOrErrors)) {
//       response.error = errorOrErrors;
//     }
//     return res.status(this.code).send(response).end();
//   }
// }

// // NOTE keeping these for backward compatibility
// export let badRequest = new HttpErrorHandler(400, 'Bad Request');
// export let unauthenticated = new HttpErrorHandler(401, 'Unauthenticated');
// export let unauthorized = new HttpErrorHandler(403, 'Unauthorized');
// export let notFound = new HttpErrorHandler(404, 'Resource not found');
// export let conflict = new HttpErrorHandler(409, 'Conflict');
// export let unprocessable = new HttpErrorHandler(422, 'Validation failed');
// export let error = new HttpErrorHandler(500, 'Something unexpected happened');

// export const errorHandlers = {
//   400: badRequest,
//   401: unauthenticated,
//   403: unauthorized,
//   404: notFound,
//   409: conflict,
//   422: unprocessable,
//   500: error,
// };

// export function handleMulterError(err, req, res, next) {
//   if (err instanceof multer.MulterError) {
//     throw new BadRequestError(err.message, [err]);
//   }
//   // I think `throw err` would also work
//   else next(err);
// }

// export function handleMongoError(err, req, res, next) {
//   // This used to work.. no longer does
//   // if (err instanceof MongoError) {
//   if (err.name == 'MongoError' && err.code == 11000) {
//     return next(new ConflictError(undefined, err.keyValue));
//   }
//   if (err instanceof mongoose.Error.ValidationError) {
//     return next(new UnprocessableError(undefined, _.toArray(err.errors)));
//   }
//   if (err.name == 'MongoError') {
//   }
//   next(err);
// }

// export function handleHttpError(err, req, res, next) {
//   if (!(err instanceof HttpError)) return next(err);
//   if (err instanceof NotificationError) {
//   }
//   // Let server errors be properly logged before being sent
//   if (err instanceof ServerError) return next(err);
//   const errorHandler = errorHandlers[err.code];
//   errorHandler.send(res, err.message, err.error);
// }

// export function errorHandler(err, req, res, next) {
//   // TODO disable verbose return errors in production
//   return res.status(500).send({
//     code: 500,
//     msg: err.message,
//     stack: err.stack,
//   });
// }
