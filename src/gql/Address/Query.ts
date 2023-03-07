import stringUtils from "../../utils/stringUtils";
export default {
  getAddress(obj, args, context, info) {
    return null;
  }, 
  async getAddressByAccountId(obj, args, context, info) {
    let user=await stringUtils.isAuthenticated(context);
    return user.addressBook;
  },
};
