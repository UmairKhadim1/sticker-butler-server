/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
import {
  DocumentType,
  getModelForClass,
  prop,
  pre,
  Ref,
} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import requestIp from 'request-ip';
import crypto from 'crypto';
import { UserInputError, AuthenticationError } from 'apollo-server-express';
import config from '../config';
import stringUtils from '../utils/stringUtils';
import { Address, IAddress } from './address.model';
import { Session, SessionModel } from './session.model';

//  interfac:any {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   // userName: string;
//   profilePhoto?: string;
//   email: string;
//   emailAddress: string[];
//   password: string;
//   confirmPassword: string;
//   isSusended: boolean;
//   addressBook: [IAddress];
// }

// @pre<User>('save', async function () {
//   try {
//     const hashPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashPassword;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// })
export class User {
  @prop({ required: true, unique: true, sparse: true })
  public _id: string;

  // @prop()
  // public firstName: string;

  // @prop()
  // public lastName: string;

  @prop({ required: false })
  public userName: string;

  // @prop({ type: () => [String] })
  // public emailAddress: string[];

  @prop({ required: true })
  public name: string;

  @prop({ required: false })
  public profilePhoto?: string;

  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true })
  public password: string;

  // @prop({ required: true })
  // public confirmPassword: string;

  @prop({ required: false })
  public isSuspended: boolean;

  @prop({ required: false })
  public token: string;
  @prop({ required: false })
  public tokenExpires: number;

  @prop({ required: false, default: false })
  public emailVerified: boolean;

  @prop({ required: false })
  public resetToken: string;

  @prop({ type: () => [Address], required: false })
  public addressBook?: Address[];

  public createToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.token = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.tokenExpires = Date.now() + 60 * 60 * 1000;
    // console.log('expiresat', this.tokenExpires);
    return resetToken;
  }

  public static async compareToken(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await UserModel.findOne({
      token: hashedToken,
      tokenExpires: { $gte: Date.now() },
    });
    return user;
  }

  public static async getUserByEmail(email) {
    try {
      const exist = await UserModel.findOne({ email });
      if (!exist) return false;
      return exist;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public async getResetToken(resetToken: string) {
    const token = await UserModel.findOne({ resetToken });
    if (!token) throw new AuthenticationError('Invalid Token');
    return token;
  }

  public static async hashPassword(password: string) {
    try {
      const hashPassword = await bcrypt.hash(password, 10);
      password = hashPassword;
      if (password) return password;
      throw new Error('Internal Server Error.');
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public static async resendVerificationLink(reqToken: string) {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(reqToken)
        .digest('hex');
      const user = await UserModel.findOne({
        token: hashedToken,
      });
      if (!user) throw new AuthenticationError(`User does not exist`);
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.token = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.tokenExpires = Date.now() + 60 * 60 * 1000;

      const htmlMessage = `<p>Hello <b>${user?.name}</b>,</p>
      Thankyou for registering your account with Sticker Butler. We just need to verify your email. Before being able to use your account you need to verify that this is your email address.<br/> Please click below in order to verify your email. <br/>
      <div style="padding:50px 100px">
      <button style="padding: 15px 45px!important; color:#105c9b !important;
      background: #ffffff !important;
      cursor:pointer !important;
      font-weight: 500;text-transform: capitalize !important;
      font-size:16px !important;
      line-height: 1em !important;
    border: 2px solid #105c9b !important;
    box-shadow: 2px 2px 0px #105c9b !important;
    border-radius: 4px !important;"><a style="text-decoration:none; 
    font-size:16px !important;
    " href="${process.env.BASE_URL}/${process.env.EMAIL_VERIFICATION_LINK}/${resetToken}"> Verify Email Address </a></button><br/>
      </div>
      Please note that the link will expire in 30 minutes. If your link has expired, you can always request another on the Login page.
      <p>
      Sincerely,<br/>
      <b>The Sticker Butler team</b>
      </p>
      
      `;

      try {
        await stringUtils.sendEmail({
          email: user.email,
          subject: 'Verify your Sticker Butler account',
          html: htmlMessage,
        });
        await user.save();
        return {
          status: 200,
          message: ' Verification Link sent to email successfully',
          // message: token,
        };
      } catch (error) {
        console.log(error);
        throw new Error(
          'There was an error sending the email, please try again later'
        );
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  public static async getUser(email: string) {
    try {
      const user = await UserModel.findOne({
        email,
        isSuspended: { $ne: true },
      });
      if (!user) throw new AuthenticationError('Invalid User');
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  //verify user account
  public static async VerifyUserAccount(reqToken: string) {
    try {
      const user = await User.compareToken(reqToken);
      console.log('sajkhjksd compare', user);
      if (!user) throw new AuthenticationError('Token is invalid or expired');
      user.emailVerified = true;
      (user.token = undefined), (user.tokenExpires = undefined);
      user.save();
      return {
        status: 200,
        message: 'Account Verified Successfully.',
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // Login User Api
  public static async LoginUser(email: string, password: string, context: any) {
    try {
      const user = await this.getUser(email);
      // console.log('logged in user', user);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        throw new UserInputError('Invalid username or password');
      const token = JWT.sign({ _id: user.id }, config.JWT_SECRET_KEY, {
        expiresIn: process.env.LOGIN_TOKEN_EXPIRE_TIME,
      });
      const refreshToken = JWT.sign(
        { userId: user.id, type: 'refresh' },
        config.JWT_REFRESH_TOKEN_SECRET_KEY,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
        }
      );
      if (token) {
        const { request } = context;
        const userId = user.id;
        const userAgent = context.request.req.headers['user-agent'];
        const ip = requestIp.getClientIp(request.req);

        Session.createSession({
          _id: stringUtils.generateUuidV4(),
          userId,
          token: refreshToken,
          userAgent,
          ip,
          valid: true,
        });
        if (user.emailVerified) {
          return {
            sessionId: 'sessionID',
            status: 200,
            tokens: {
              accessToken: token,
              refreshToken,
            },
            user,
          };
        } else {
          return {
            sessionId: 'sessionID',
            status: 200,
            tokens: {
              accessToken: null,
              refreshToken: null,
            },
            user,
          };
        }
      }
      throw new Error('Internal Server Error');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // forgot Password Api
  public static async forgotPassword(email: string) {
    try {
      const user = await this.getUser(email);
      if (user && user.emailVerified) {
        const token = JWT.sign(
          { _id: user.id },
          config.JWT_FORGOTPASSWORD_SECRET_KEY,
          { expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRE_TIME }
        );
        user.resetToken = token;
        await user.save();

        const htmlMessage = `<p>Hello <b>${user?.name}</b>,</p>

        Someone (hopefully you!) has requested to change your Sticker butler password. Please click the link below to change your password now.
        <br/>
        <div style="padding:50px 100px">
        <button style="padding: 15px 45px!important; color:#105c9b !important;
        background: #ffffff !important;
        cursor:pointer !important;
        font-weight: 500;text-transform: capitalize !important;
        font-size:16px !important;
        line-height: 1em !important;
      border: 2px solid #105c9b !important;
      box-shadow: 2px 2px 0px #105c9b !important;
      border-radius: 4px !important;"><a style="text-decoration:none; 
      font-size:16px !important;
      " href="${
        process.env.BASE_URL + process.env.RESET_PASSWORD
      }/${token}"> Reset Account Password </a></button><br/>
        </div>
If you didn't make this request, please disregard this email.
Please note that your password will not change unless you click the link above and create a new one. This link will expire in 10 minutes. If your link has expired, you can always request another.
<br/>
If you've requested multiple reset emails, please make sure you click the link inside the most recent email.
<p>
        Sincerely,<br/>
        <b>The Sticker Butler team</b>
        </p>
        
        `;
        // const htmlMessage =
        //   `<p>You are receiving this email because you (or someone else) has requested to reset the password.
        //       Please click on this link below to reset your password:\n ${resetUrl}` +
        //   '\n' +
        //   'If you did not request this, please ignore this email.</p>';
        try {
          await stringUtils.sendEmail({
            email: user.email,
            subject: 'Password Reset',
            html: htmlMessage,
          });
          return {
            status: 200,
            message: `Link has been sent to your  email for reset password. Don't Forget to Check your Email in Spam folder.`,
            // message: token,
          };
        } catch (error) {
          console.log('email sending error', error.message);
          throw new Error(
            'There was an error sending the email, please try again later'
          );
        }
      }
      throw new AuthenticationError('Please Verify your Email');
    } catch (error) {
      throw new Error(error);
    }
  }

  // verify token for reset password
  public static async verifyResetToken(token: string) {
    try {
      if (!token) {
        throw new UserInputError('No Token Provided');
      } else {
        const obj = new UserModel();
        const user = await obj.getResetToken(token);
        if (user) {
          const id = await stringUtils.getUserIdFromToken(
            user.resetToken,
            config.JWT_FORGOTPASSWORD_SECRET_KEY
          );

          if (!id) {
            throw new UserInputError(' Invalid Token');
          }
          return {
            status: 200,
            message: 'Token Verified',
          };
        } else {
          throw new Error('Something went wrong');
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Reset Password Api
  public static async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ) {
    try {
      if (!token) {
        throw new UserInputError('No Token Provided');
      } else {
        const obj = new UserModel();
        const userData = await obj.getResetToken(token);
        const id = await stringUtils.getUserIdFromToken(
          userData.resetToken,
          config.JWT_FORGOTPASSWORD_SECRET_KEY
        );
        const user = await UserModel.findOne({
          _id: id,
          isSuspended: { $ne: true },
          emailVerified: { $ne: false },
        });

        if (user) {
          if (password !== confirmPassword)
            throw new UserInputError(
              'Password and Confirm Password must match .'
            );
          const newPassword = await UserModel.hashPassword(password);
          user.password = newPassword;
          user.resetToken = undefined;
          await user.save();
          return {
            status: 200,
            message: 'Password successfully Updated',
          };
        }
        throw new AuthenticationError('Please Verify your Email');
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  // update user Api
  public async UpdateUser() {
    try {
      if (!this._id) {
        throw new AuthenticationError('User Not Found.');
      }
      const existingUser = await this.getUserById();
      if (existingUser) {
        if (this.name) {
          existingUser.name = this.name;
        }
        if (this.profilePhoto) {
          existingUser.profilePhoto = this.profilePhoto;
        }
        await existingUser.save();
        return {
          status: 200,
          message: 'Account Updated Successfuly.',
        };
      }
      throw new Error('Internal Server Error');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // delete Account Api
  public static async deleteUser(id: string) {
    try {
      if (!id) {
        throw new AuthenticationError('User Not Found.');
      }
      const existingUser = await UserModel.findByIdAndRemove(id);
      if (existingUser) {
        return {
          status: 200,
          message: 'Account Deleted Successfuly.',
        };
      }
      throw new Error('Internal Server Error');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async suspendUser() {
    try {
      if (!this._id) {
        throw new AuthenticationError('User Not Found.');
      }
      const existingUser = await UserModel.findByIdAndUpdate(this._id);
      if (existingUser) {
        existingUser.isSuspended = true;
        return {
          status: 200,
          message: 'User Suspended Successfuly.',
        };
      }
      throw new Error('Internal Server Error');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public static async LogOutUser(userId: string, refreshToken: string) {
    try {
      const logedInUser = await SessionModel.findOneAndUpdate({
        $and: [{ userId }, { token: refreshToken }],
      });
      if (logedInUser) {
        logedInUser.valid = false;
        await logedInUser.save();
        return {
          status: 204,
          message: 'Log Out Successfuly.',
        };
      }
      throw new Error('Internal Server Error.');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public static async refreshToken(token: string, refreshToken: string) {
    try {
      const { _id } = (await JWT.decode(token, config.JWT_SECRET_KEY)) as any;
      const user = await UserModel.findOne({ _id });
      const logedInUser = await SessionModel.findOne({
        userId: _id,
        valid: true,
        token: refreshToken,
      });
      if (logedInUser) {
        const newAccessToken = JWT.sign(
          { _id: user.id },
          config.JWT_SECRET_KEY,
          {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
          }
        );
        return {
          sessionId: 'sessionID',
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newAccessToken,
          },
          user,
        };
      }
      throw new Error('Please Login .');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getUserById() {
    try {
      const user = await UserModel.findOne({
        _id: this._id,
        isSuspended: { $ne: true },
      });
      if (!user) {
        throw new AuthenticationError('User Not Found.');
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export const UserModel = getModelForClass(User);
export type UserDoc = DocumentType<User>;
