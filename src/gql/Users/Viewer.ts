import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ShopModel } from '../../models/shopify.model';
import stringUtils from '../../utils/stringUtils';
export default {
  async store(parent, args, context, info) {
    try {
      let selector = {};
      selector['createdBy'] = parent._id;

      const allShops = new ShopModel(selector);
      const res = await allShops.getShops();
      if (res) {
        const shop = res[0];

        return shop?.name;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
