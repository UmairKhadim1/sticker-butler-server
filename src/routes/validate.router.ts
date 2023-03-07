const express = require('express');

const validateRouter = express.Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');
const passportConfig = require('../passport/passport');
const userModel = require('../models/user.model');
const todoModel = require('../models/todo.model');
// middleware that is specific to this router
validateRouter.use((req, res, next) => {
  // console.log(req.headers);
  // console.log("Body :" + req.body);
  console.log(req.url);
  // console.log(req.cookies);
  // console.log(req.secret);
  // console.log(req.signedCookies);

  console.log('Time: ', Date.now());

  next();
});

validateRouter.post('/email', (req, res) => {
  const { email } = req.body;
  userModel.findOne({ email }, (err, user) => {
    if (err) {
      res.status(400).json({
        message: {
          msgBody: 'Error while validating email',
          msgError: false,
          debugErr: err,
        },
      });
    }
    if (user) {
      res.status(200).json({
        message: {
          msgBody: 'Email already in use',
          msgError: true,
          debugErr: user,
        },
      });
    }
    res.status(201).json({
      message: {
        msgBody: 'Email is valid',
        msgError: false,
        debugErr: user,
      },
    });
  });
});

module.exports = validateRouter;
