/* eslint-disable prefer-destructuring */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable new-cap */

import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT, { ExtractJwt } from 'passport-jwt';
import config, { isTest } from '../config';
import logger from '../helpers/logger';
import { UserModel } from '../models/users.model';
/* eslint-disable max-len */
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const JWTStrategy = require('passport-jwt').Strategy;

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;

// const tokenExtractor = req => {
//   let token = null;
//   if (req && req.header('authorization')) {
//     token = req.header('authorization');
//     token = token.split(' ')[1];
//   }
//   return token;
// };
// console.log("config =>", config)
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: config.JWT_SECRET_KEY || "evergreen_dev_db",
      secretOrKey: config.JWT_SECRET_KEY,
    },
    async (payload, done) => {
      logger.info('Passport', `[JWTStrategy]`);
      try {
        let { user } = payload;
        const { _id } = user;
        user = await UserModel.findById(_id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Authetication local strategy using username and password
passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      logger.info('Passport', `[LocalStrategy]`);
      const user = await UserModel.findOne({ email });
      if (!user) {
        return done(null, false);
      }
      // const isMatch = await user.comparePassword(password);
      // if (isMatch) return done(null, user);
      // return done(null, false);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
