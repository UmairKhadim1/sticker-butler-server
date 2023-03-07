import { Campaign, CampaignModel } from '../../models/campaign.model';
import stringUtils from '../../utils/stringUtils';

export default {
  async createCampaign(parent, args, context, info) {
    try {
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return null;
      const { campaignName, addressId } = args.input;

      const newCampaign = await new CampaignModel({
        _id: stringUtils.generateUuidV4(),
        name: campaignName,
        addressId,
        step:"1",
        createdBy:context.userId
      });
      newCampaign.save();
      if (newCampaign) {
        return {
          status: 200,
          message: 'Campaign Save Successfuly',
          campaignData: newCampaign,
        };
      } else {
        throw new Error('Internal Server Error');
      }
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async updateCampaign(parent, args, context, info) {
    try {
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const {
        addressId,
        campaignName,
        segmentId,
        campaignId,
        trackingInterval,
        discountCode,discountCodeId,
        step,
        type,
        designId,
      } = args.input;
      if (!campaignId || campaignId == '') {
        throw new Error('Campaign Id is required ');
      }
      let updateObj = { _id: campaignId };
      context.userId;

      if (campaignName) {
        updateObj['name'] = campaignName;
      }
      if (discountCodeId) {
        updateObj['discountCodeId'] = discountCodeId;
      }
      
      if (segmentId) {
        updateObj['segmentId'] = segmentId;
      }
      if (addressId) {
        updateObj['addressId'] = addressId;
      }
      if (trackingInterval) {
        updateObj['trackingInterval'] = trackingInterval;
      }
      if (discountCode) {
        updateObj['discountCode'] = discountCode;
      }
      if (type) {
        updateObj['type'] = type;
      }

      if (designId) {
        updateObj['designId'] = designId;
      } if (step) {
        updateObj['step'] = step;
      }

      const updatedCampaign = await new CampaignModel(updateObj);
      let res = await updatedCampaign.updateCampaign();
      if (res) {
        return res;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async deleteCampaign(parent, args, context, info) {
    try {
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;

      const deletedCampaign = await new CampaignModel({
        _id: args.input.campaignId,
      });
      const res = deletedCampaign.deleteCampaign();
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
