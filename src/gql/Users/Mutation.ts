import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { UserModel } from '../../models/users.model';
import stringUtils from '../../utils/stringUtils';

const userMutations = {
  async createUser(parent, args, context, info) {
    try {
      const { name, email, password, confirmPassword } = args.input;
      const exist = await UserModel.getUserByEmail(email);
      if (exist) throw new Error(`User with email '${email}' already exist.`);
      if (password !== confirmPassword)
        throw new UserInputError('Password and Confirm Password must match .');
      const newPassword = await UserModel.hashPassword(password);
      if (!newPassword) return false;
      const newUser = await new UserModel({
        _id: stringUtils.generateUuidV4(),
        name,
        email,
        password: newPassword,
        isSuspended: false,
      });
      const token = newUser.createToken();
      const htmlMessage = `<p>Hello <b>${name}</b>,</p>

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
    " href="${process.env.BASE_URL}/${process.env.EMAIL_VERIFICATION_LINK}/${token}"> Verify Email Address </a></button><br/>
      </div>
      Please note that the link will expire in 30 minutes. If your link has expired, you can always request another on the Login page.
      <p>
      Sincerely,<br/>
      <b>The Sticker Butler team</b>
      </p>
      
      `;
      // const htmlMessage = `<p>Please click on the given link to verify your account:\n\n
      //  <a href="${process.env.BASE_URL}/${process.env.EMAIL_VERIFICATION_LINK}/${token}">Click Here</a>\n\n.</p>`;
      try {
        await stringUtils.sendEmail({
          email: email,
          subject: 'Verify your Sticker Butler account',
          html: htmlMessage,
        });
        await newUser.save();
        return {
          status: 200,
          message:
            'Successfully Registered And Verification Link sent to email',
        };
      } catch (error) {
        console.log('email sending error', error.message);
        throw new Error(
          'There was an error sending the email, please try again later'
        );
      }
    } catch (err) {
      // console.log('user regitration  error', err.message);
      throw new Error(err.message);
    }
  },

  async VerifyAccount(parent, args, context, info) {
    try {
      const verifiedUser = await UserModel.VerifyUserAccount(
        args.input.verifyToken
      );
      if (!verifiedUser) return null;
      return verifiedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async resendVerifyAccountLink(parent, args, context, info) {
    try {
      const result = await UserModel.resendVerificationLink(args.input.token);
      if (!result) return null;
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async loginUser(parent, args, context, info) {
    try {
      const userData = await UserModel.LoginUser(
        args.input.email,
        args.input.password,
        context
      );
      if (userData) {
        return userData;
      }
      return false;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async logOut(parent, args, context, info) {
    try {
      const logOutUser = await UserModel.LogOutUser(
        context.userId,
        args.input.refreshToken
      );
      if (logOutUser) {
        return logOutUser;
      }
      return null;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async refreshToken(parent, args, context, info) {
    try {
      const newToken = await UserModel.refreshToken(
        args.input.accessToken,
        args.input.refreshToken
      );
      if (newToken) {
        return newToken;
      }
      return null;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async forgotPassword(parent, args, context, info) {
    try {
      const userEmail = await UserModel.forgotPassword(args.input.email);
      if (userEmail) {
        return userEmail;
      }
      return null;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async verifiedToken(parent, args, context, info) {
    try {
      const tokenResult = await UserModel.verifyResetToken(args.input.token);
      if (tokenResult) {
        return true;
      }
      return false;
    } catch (err) {
      return false;

      // throw new Error(err.message);
    }
  },
  async resetPassword(parent, args, context, info) {
    try {
      const passwordresult = await UserModel.resetPassword(
        args.input.token,
        args.input.password,
        args.input.confirmPassword
      );
      if (passwordresult) {
        return passwordresult;
      }
      return null;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async updateUser(parent, args, context, info) {
    try {
      const { name, profilePhoto } = args.input;
      const { userId } = context;
      const res = await new UserModel({
        _id: userId,
        name,
        profilePhoto,
      });
      const updatedUser = res.UpdateUser();
      if (updatedUser) {
        return updatedUser;
      }
      return null;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async deleteUser(parent, args, context, info) {
    try {
      const deletedUser = await UserModel.deleteUser(context.userId);
      if (deletedUser) {
        return deletedUser;
      }
      return null;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async suspendUser(parent, args, context, info) {
    try {
      const { userId } = context;
      const suspendUser = await new UserModel({ _id: userId });
      const res = await suspendUser.suspendUser();
      if (res) {
        return res;
      }
      return null;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

export default userMutations;
