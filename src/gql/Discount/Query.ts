import { AuthenticationError } from 'apollo-server-core';
import { ShopModel } from '../../models/shopify.model';
import discount from '../../utils/Shopify/discount';
import stringUtils from '../../utils/stringUtils';

var housecall = require('housecall');
var queue = housecall({ concurrency: 2, cooldown: 1000 });
const shop = new ShopModel();

export default {
  async getDiscountPriceRules(obj, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const shop = new ShopModel({ createdBy: context.userId });
      const shopData = await shop.getShops();
      if(shopData[0]){
      const { name, accessToken } = await shopData[0];
      const discountPriceRules = await discount.getDiscountPriceRules(
        name,
        accessToken
      );

      if (discountPriceRules.price_rules) {

      
        return discountPriceRules.price_rules;
      } else if (discountPriceRules.price_rule) {
        return [discountPriceRules.price_rule];
      } else {
        return null;
      }}
      else{
        return null;

      }
    } catch (err) {
      throw new Error(err);
    }
  },

  async getDiscountPriceRule(obj, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const shop = new ShopModel({ createdBy: context.userId });
      const shopData = await shop.getShops();
      const { name, accessToken } = await shopData[0];
      const discountPriceRule = await discount.getDiscount(
        name,
        accessToken,
        args.priceRuleId
      );
      if (discountPriceRule) {
        return discountPriceRule;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  async getDiscounts(obj, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const shop = new ShopModel({ createdBy: context.userId });
      const shopData = await shop.getShops();
      const { name, accessToken } = await shopData[0];
      // console.log('name', name);
      // console.log('accessToken', accessToken);
      console.log("args.priceRuleId",  args.priceRuleId)
      const discountCodes = await discount.getDiscounts(
        name,
        accessToken,
        args.priceRuleId
      );
      if (discountCodes) {
        return discountCodes;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  async getDiscount(obj, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const shop = new ShopModel({ createdBy: context.userId });
      const shopData = await shop.getShops();
      const { name, accessToken } = await shopData[0];
      // console.log('name', name);
      // console.log('accessToken', accessToken);
      const discountCode = await discount.getDiscount(name, accessToken, args);
      console.log('discountCode', discountCode);
      if (discountCode) {
        return discountCode;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  },
};
