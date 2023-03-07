/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import ApiError from './api.error';

function apiErrorHanlder(err, req, res, next) {
  // in production dont use console.log or console.err
  // because it is not async
  if (process.env.NODE_ENV === 'development') {
    // console.error('api.err ==> ', err.message);
  }
  if (err instanceof ApiError) {
    res.status(err.code).json(err.message);
    return;
  }
  res.status(500).json('something went wrong');
}
export default apiErrorHanlder;
