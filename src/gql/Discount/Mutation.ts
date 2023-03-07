import { AuthenticationError } from 'apollo-server-core';
import { ShopModel } from '../../models/shopify.model';
import discount from '../../utils/Shopify/discount';
import stringUtils from '../../utils/stringUtils';

const discountsMutations = {
  async createDiscountCodePriceRule(parent, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const shop = new ShopModel({ createdBy: context.userId });
      const shopData = await shop.getShops();
      const { name, accessToken } = await shopData[0];
      const {
        title,
        target_type,
        target_selection,
        allocation_method,
        value_type,
        value,
        customer_selection,
        starts_at,
        usage_limit,
        once_per_customer,
      } = args.input;
      const discountPricerules = (await discount.createDiscountPriceRules(
        name,
        accessToken,
        {
          title,
          target_type,
          target_selection,
          allocation_method,
          value_type,
          value,
          customer_selection,
          starts_at,
          usage_limit,
          once_per_customer,
        }
      )) as any;
      if (discountPricerules.errors) {
        return { message: discountPricerules.errors };
      } else {
        let { discountCode } = args.input;
        let InputCodes = discountCode && discountCode.split(',');
        let codes = InputCodes.map(item => {
          return {
            code: item,
          };
        });
        const discountCodesCreation = (await discount.discountCodeCreation(
          name,
          accessToken,
          { id: discountPricerules.price_rule.id, codes }
        )) as any;

        const { discount_code_creation } = discountCodesCreation;
        if (discount_code_creation && discountPricerules) {
          return {
            price_rule_id: discountPricerules.price_rule.id,
            codes: InputCodes,
          };
        }
        // return {
        //   price_rule: discountPricerules,
        //   discount_code_creation: discount_code_creation,
        // };
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  // async updateDiscountCodePriceRule(parent, args, context, info) {
  //   try {
  //     if (!context.userId) {
  //       throw new AuthenticationError('Authentication Error');
  //     }
  //     const user = await stringUtils.getUserById(context.userId);
  //     if (!user) return false;
  //     const shop = new ShopModel({ createdBy: context.userId });
  //     const shopData = await shop.getShops();
  //     const { name, accessToken } = await shopData[0];
  //     const updateDiscountCodePriceRule =
  //       (await discount.updateDiscountPriceRules(
  //         name,
  //         accessToken,
  //         args.input
  //       )) as any;
  //     if (updateDiscountCodePriceRule.errors) {
  //       return { message: updateDiscountCodePriceRule.errors };
  //     } else {
  //       return updateDiscountCodePriceRule;
  //     }
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // },

  // async deleteDiscountCodePriceRule(parent, args, context, info) {
  //   try {
  //     if (!context.userId) {
  //       throw new AuthenticationError('Authentication Error');
  //     }
  //     const user = await stringUtils.getUserById(context.userId);
  //     if (!user) return false;
  //     const shop = new ShopModel({ createdBy: context.userId });
  //     const shopData = await shop.getShops();
  //     const { name, accessToken } = await shopData[0];
  //     const deleteDiscountCodePriceRule =
  //       (await discount.deleteDiscountPriceRules(
  //         name,
  //         accessToken,
  //         args.input.id
  //       )) as any;

  //     if (deleteDiscountCodePriceRule.errors) {
  //       return { message: deleteDiscountCodePriceRule.errors };
  //     } else {
  //       return { message: 'Deleted Successfully' };
  //     }
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // },

  //DISCOUNT CODE
  async createDiscountCode(parent, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const shop = new ShopModel({ createdBy: context.userId });
      const shopData = await shop.getShops();
      const { name, accessToken } = await shopData[0];
      const discountCodesCreation = (await discount.discountCodeCreation(
        name,
        accessToken,
        args.input
      )) as any;
      if (discountCodesCreation.errors) {
        return { message: discountCodesCreation.errors };
      } else {
        return discountCodesCreation;
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  // async updateDiscountCode(parent, args, context, info) {
  //   try {
  //     if (!context.userId) {
  //       throw new AuthenticationError('Authentication Error');
  //     }
  //     const user = await stringUtils.getUserById(context.userId);
  //     if (!user) return false;
  //     const shop = new ShopModel({ createdBy: context.userId });
  //     const shopData = await shop.getShops();
  //     const { name, accessToken } = await shopData[0];
  //     const updateDiscountCode = (await discount.updateDiscountCode(
  //       name,
  //       accessToken,
  //       args.input
  //     )) as any;
  //     console.log('updateDiscountCode', updateDiscountCode);
  //     if (updateDiscountCode.errors) {
  //       return { message: updateDiscountCode.errors };
  //     } else {
  //       return updateDiscountCode;
  //     }
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // },

  // async deleteDiscountCode(parent, args, context, info) {
  //   try {
  //     if (!context.userId) {
  //       throw new AuthenticationError('Authentication Error');
  //     }
  //     const user = await stringUtils.getUserById(context.userId);
  //     if (!user) return false;
  //     const shop = new ShopModel({ createdBy: context.userId });
  //     const shopData = await shop.getShops();
  //     const { name, accessToken } = await shopData[0];
  //     const deleteDiscountCode = (await discount.deleteDiscountCode(
  //       name,
  //       accessToken,
  //       args.input
  //     )) as any;
  //     console.log('deleteDiscountCode', deleteDiscountCode);
  //     if (deleteDiscountCode.errors) {
  //       return { message: deleteDiscountCode.errors };
  //     } else {
  //       return deleteDiscountCode;
  //     }
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // },
};

export default discountsMutations;
