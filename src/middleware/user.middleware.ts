import ApiError from '../error/api.error';

const userMiddleware = {
  validateUserBody: async (req, res, next) => {
    if (!req.body) return next(ApiError.badRequest('Request body is empty.'));
  },
  ensureAdmin: async (req, res, next) => {
    if (req.user.isAdmin()) return next();
    return next(ApiError.badRequest('User is not admin.'));
  },
};

export default userMiddleware;
