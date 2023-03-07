import ApiError from '../error/api.error';
import logger from '../helpers/logger';
import stringUtils from '../utils/stringUtils';

const commonMiddlewares = {
  ensureRequestBody: async (req, res, next) => {
    logger.info('commonMiddlewares', `[ensureRequestBody]`);
    if (!req.body) return next(ApiError.badRequest('Request body is empty.'));
    return next();
  },
  ensureRequestBodyKey: key => async (req, res, next) => {
    logger.info('commonMiddlewares', `[ensureRequestBodyKey]`);
    try {
      if (!req.body.email)
        return next(
          ApiError.badRequest(`Param '${key}' is missing from request body.`)
        );
      return next();
    } catch (err) {
      return next(ApiError.intervalServerError(err.message));
    }
  },
  attachParams: async (req, res, next) => {
    logger.info('commonMiddlewares', `[attachParams]`);
    try {
      req.locals = {};
      if (Object.keys(req.params).length !== 0) {
        Object.entries(req.params).forEach(([key, value]) => {
          req.locals[key] = value;
        });
      } else {
        throw new Error('params are missing ');
      }

      next();
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  },
};

export default commonMiddlewares;
