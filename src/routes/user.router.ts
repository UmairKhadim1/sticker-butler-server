/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-curly-newline */
/* eslint-disable no-shadow */
import express, { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { logger } from '@typegoose/typegoose/lib/logSettings';
import { mongoose } from '@typegoose/typegoose';
import { UserModel } from '../models/users.model';
import ApiError from '../error/api.error';
import commonMiddlewares from '../middleware/commonMiddlewares';
import passport from '../passport/passport';
import config from '../config';

const userRouter = express.Router();

const { body, validationResult, errors } = require('express-validator/check');

// userRouter.post(
//   '/validate/email',
//   commonMiddlewares.ensureRequestBody,
//   commonMiddlewares.ensureRequestBodyKey('email'),
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const exists = await UserModel.userWithEmailExists(req.body.email);
//       if (exists) {
//         return res.send({
//           msg: 'Email is valid.',
//           exists: true,
//         });
//       }

//       return res.send({
//         msg: 'Email not found.',
//         exists: false,
//       });
//     } catch (err) {
//       return next(ApiError.intervalServerError(err.message));
//     }
//   }
// );

userRouter.get(
  '/authenticated',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.isAuthenticated()) {
        const payload = {
          isAuthenticated: true,
          user: {
            _id: req.user._id,
            email: req.user.email,
            role: req.user.role,
          },
        };
        return res.send(payload);
      }
    } catch (err) {
      return next(ApiError.intervalServerError(err.message));
    }
  }
);

userRouter.post(
  '/login',
  commonMiddlewares.ensureRequestBody,
  body('username').not().isEmpty(),
  body('password').not().isEmpty(),
  passport.authenticate('local'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('UserRoute', `[login]`);
      if (req.isAuthenticated()) {
        const { user } = req;
        const body = { _id: user._id, email: user.email };
        const token = JWT.sign({ user: body }, config.JWT_SECRET_KEY);
        return res.json(token);
      }

      throw new Error('Unauthorized');
    } catch (err) {
      return next(ApiError.intervalServerError(err.message));
    }
  }
);

userRouter.get(
  '/',
  // passport.authenticate('jwt', { session: false }),
  // userMiddleware.ensureAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.find();
      return res.send(users);
    } catch (err) {
      return next(ApiError.intervalServerError(err.message));
    }
  }
);

userRouter.delete(
  '/:userId',
  passport.authenticate('jwt'),
  commonMiddlewares.attachParams,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deletedCount } = await UserModel.deleteOne({
        _id: req.locals.userId,
      });
      if (deletedCount === 0) {
        return res.send(false);
      }
      return res.send(true);
    } catch (err) {
      return next(ApiError.intervalServerError(err.message));
    }
  }
);
userRouter.get(
  '/:userId',
  passport.authenticate('jwt'),
  commonMiddlewares.attachParams,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.find({ _id: req.locals.userId });
      return res.send(user);
    } catch (err) {
      return next(ApiError.intervalServerError('user not found.'));
    }
  }
);

userRouter.post(
  '/',
  // passport.authenticate('jwt'),
  commonMiddlewares.ensureRequestBody,
  [
    body('firstName').not().isEmpty(),
    body('lastName').not().isEmpty(),
    body('mobile').not().isEmpty(),
    body('email').not().isEmpty(),
    body('password').not().isEmpty(),
    body('mobile').not().isEmpty(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors: any = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
      }
      const { firstName, lastName, mobile, email, password, role } = req.body;
      let user = new UserModel({
        // _id: stringUtils.generateUuidV4(),
        _id: new mongoose.Types.ObjectId(),
        firstName,
        lastName,
        email,
        mobile,
        password,
        role,
      });
      user = await user.save();
      return res.send(user);
    } catch (err) {
      return next(ApiError.intervalServerError(err.message));
    }
  }
);

export default userRouter;
