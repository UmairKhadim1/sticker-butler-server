import { UserModel } from '../../models/users.model';
import { SegmentModel } from '../../models/segment.model';
import { DesignModel } from '../../models/design.model';
import { ShopModel } from '../../models/shopify.model';
import discount from '../../utils/Shopify/discount';
import stringUtils from '../../utils/stringUtils';
export default {
  async address(parent, args, context, info) {
    // return parent.addressId
    try {
      const userExist = await UserModel.findOne({ _id: context.userId });
      if (userExist) {
        const addressExist = userExist.addressBook.find(
          adress => adress._id === parent.addressId
        );
        return addressExist;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async segment(parent, args, context, info) {
    // return parent.addressId
    try {
      const segmentExist = await SegmentModel.findOne({
        _id: parent.segmentId,
      });
      if (segmentExist) {
        return segmentExist;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async design(parent, args, context, info) {
    // return parent.addressId
    try {
      const designExist = await DesignModel.findOne({ _id: parent.designId });
      if (designExist) {
        return designExist;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async trackingData(parent, args, context, info){
    console.log("tracking data for ",parent.discountCodeId)
    if(parent.discountCodeId){
    try {
     
      const shop = new ShopModel({ createdBy: parent.createdBy });
      const shopData = await shop.getShops();
      const { name, accessToken } = await shopData[0];
      // console.log('name', name);
      // console.log('accessToken', accessToken);
      const discountCodes = await discount.getDiscounts(
        name,
        accessToken,
        parent.discountCodeId
      );
      if (discountCodes&&discountCodes?.discount_codes[0]) {
        return discountCodes?.discount_codes[0]?.usage_count;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  }
 
};
