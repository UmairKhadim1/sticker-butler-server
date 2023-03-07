import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ShopModel } from '../../models/shopify.model';
import stringUtils from '../../utils/stringUtils';
export default {
  async getShops(parent, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      let selector = {};
      selector['createdBy'] = context.userId;
    
      const allShops = await new ShopModel(selector);
      const res = await allShops.getShops();
      if (res) {
        return res;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
