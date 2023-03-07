import { User, UserModel } from '../../models/users.model';

export default {
  async getUser(obj, args, context, info) {
    // test code
    // console.log("context",context.request.req)
    try {
      const {userId} = context;
      const res = await new UserModel({_id:userId});
      const user = res.getUserById();
      if (user) {
        return user;
      }
      return null;
    } catch (err) {
      throw new Error(err.nessage);
    }
    // return {"_id":context.userId?context.userId:"not logged in"}
  },

  pingServer(obj, args, context, info) {
    return new Date();
  },
};
