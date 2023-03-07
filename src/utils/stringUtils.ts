/* eslint-disable no-bitwise */
/* eslint-disable implicit-arrow-linebreak */
import { AuthenticationError } from 'apollo-server-express';
import nodemailer from 'nodemailer';
import JWT from 'jsonwebtoken';
var sgTransport = require('nodemailer-sendgrid-transport');

import { UserModel } from '../models/users.model';
import { ShopModel } from '../models/shopify.model';

const stringUtils = {
  removeQuotes: str => str.replace(/['"]+/g, ''),
  isYear: str => /^[0-9]{4}$/.test(str),
  isNumeric: str => !Number.isNaN(Number(str)),
  isInt: str => !Number.isNaN(Number(str)) && Number.isInteger(parseFloat(str)),
  capitalizeFirstLetter: string =>
    string.charAt(0).toUpperCase() + string.slice(1),
  removeWhiteSpaces: str => str.replace(/\s+/g, ' ').trim(),
  removeSpecialChrachters: str => str.replace(/[^\w\s]/gi, ''),
  cleanMysqlString: str => {
    try {
      let cleaned = stringUtils.removeWhiteSpaces(str);
      cleaned = stringUtils.removeSpecialChrachters(cleaned);
      return stringUtils.capitalizeFirstLetter(cleaned);
    } catch (err) {
      throw new Error(err.message);
    }
  },

  generateUuidV4() {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  async isAuthenticated(context) {
    if (!context.userId) {
      throw new AuthenticationError('Authentication Error');
    }
    const user = await stringUtils.getUserById(context.userId);
    if (!user) return false;
    return user;
  },

  async getUserIdFromToken(token, secretKey) {
    try {
      const decoded = await JWT.verify(token, secretKey);
      const { _id } = decoded as any;
      return _id;
    } catch (err) {
      throw new AuthenticationError(err);
    }
  },

  async getUserById(id: string) {
    try {
      const user = UserModel.findOne({ _id: id, isSuspended: false });
      if (!user) {
        throw new AuthenticationError('User Not Found.');
      }
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
  async getShopByName(name: any) {
    try {
      const shopData = ShopModel.findOne({name:name });
    
      return shopData;
    } catch (error) {
      throw new Error(error);
    }
  },

  async sendEmail(options) {
    // Node mailer Old
    // //creating a transporter
    // const transporter = nodemailer.createTransport(sgTransport({
    //   // host: process.env.EMAIL_HOST,
    //   // port: process.env.EMAIL_PORT as any,
    //   // // port:465,
    //   // secure: false,

    //   auth: {
    //     api_user: process.env.USER_EMAIL,
    //     api_key: process.env.USER_PASSWORD
    //   },

    //   // auth: {
    //   //   user: process.env.USER_EMAIL,
    //   //   pass: process.env.USER_PASSWORD,
    //   // },
    // }));
    // //define  the email options
    // const mailOptions = {
    //   from: process.env.USER_EMAIL,
    //   to: options.email,
    //   subject: options.subject,
    //   html: options.html,
    //   text: options.message,
    // };
    // //now send email
    // await transporter.sendMail(mailOptions);

    //SendGrid Email Direct integration starts here//
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      from: process.env.FROM,
      // from: "info@stickerbutler.com",
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.message,
    };
   await sgMail
      .send(msg)
      // .then(() => {
      //   console.log('Email sent');
      // })
      // .catch(error => {
      //   console.error(error);
      // });
  },
  //SendGrid Email Direct integration ends here//
};
export default stringUtils;
