import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ShopModel } from '../../models/shopify.model';
import stringUtils from '../../utils/stringUtils';
import getShopAccessToken from '../../utils/getShopAccessToken';
export default {
  async connect(parent, args, context, info) {
    try {
      console.log("context.userId",context.userId)
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const { shop, code } = args.input;
      const isShop = await stringUtils.getShopByName(shop)
      console.log("isShop", isShop)
      if(isShop&&isShop.createdBy!=context.userId){
        throw new Error('This store is already linked with another account.');

      }
      let connection_response = <any>await getShopAccessToken(shop, code);
      console.log("connection_response",connection_response);
      const { access_token, scope } = JSON.parse(connection_response);
      
    if(isShop?.createdBy==context.userId){
      return isShop;
    }
    const shopObj = new ShopModel({ createdBy: context.userId });
      const shopData = await shopObj.getShops();
      if(shopData[0]){
        throw new Error('Can connect more than one shop to single account .');

      }
      let ShopCreated = await new ShopModel({
        accessToken: access_token,
        scope: scope,
        name: shop,
        createdBy: context.userId,
        _id: stringUtils.generateUuidV4(),
      });
      await ShopCreated.save();
      if (ShopCreated) {
        return ShopCreated;
      }
      throw new Error('Failed to Create Shop.');
    } catch (err) {
      console.log("err",err)
      throw new Error(err.message);
    }
  },
};
