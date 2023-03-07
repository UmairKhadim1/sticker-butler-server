import { Router } from 'express';
import PromiseRouter from 'express-promise-router';
import userRouter from './user.router';
// import { setCORS } from '../middleware/cors';
// import * as errors from '../utils/errors';

const apiRouterV1 = PromiseRouter({ mergeParams: true });

apiRouterV1.use('/users', userRouter);

// Last route is a catch-all for 404
apiRouterV1.use(async (req, res) =>
  //   errors.notFound.send(res, `Route not found: ${req.baseUrl}${req.url}`);
  res.send(`Route not found: ${req.baseUrl}${req.url}`)
);

export default apiRouterV1;
