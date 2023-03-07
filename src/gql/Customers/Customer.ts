import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ShopModel } from '../../models/shopify.model';
import stringUtils from '../../utils/stringUtils'; import getShopifyOrderById from "../../utils/getShopifyOrderById";
export default {

    async last_order(parent, args, context, info) {
        console.log("last order data ", parent.last_order_id)
if(parent.last_order_id){
        if (!context.userId) {
            throw new AuthenticationError('Authentication Error');
          }
          const user = await stringUtils.getUserById(context.userId);
          if (!user) return false;
          let selector = {};
          selector['createdBy'] = context.userId;
    
          const allShops =  new ShopModel(selector);
          const res = await allShops.getShops();
    
        if (res) {
            const shop = res[0];

            let shopifyOrdres = await getShopifyOrderById(shop.name, shop.accessToken,  parent.last_order_id);
            if (shopifyOrdres) {
                const data = JSON.parse(shopifyOrdres);
                return data.order;
            }
        }
    }
    else{
        return null;
    }
    }
}