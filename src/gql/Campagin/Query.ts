import { Campaign, CampaignModel } from '../../models/campaign.model';
import getPaginatedData from '../../utils/getPagination';
import stringUtils from '../../utils/stringUtils';
let campaignObj = new Campaign();
export default {
  getCampaign(obj, args, context, info) {
    return null;
  },

  async getAllCampaigns(obj, args, context, info) {
    try {
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const {
        searchQuery,
        sortBy,
        orderBy,
        filterBy,
        limit,
        pageNumber,
        startCursor,
        endCursor,
      } = args;
      const pageInfo = {
        pageNumber,
        startCursor,
        endCursor,
        limit,
        sortBy,
      };
      const otherFilters={"paymentStatus": false}

      const paginatedResult = await getPaginatedData(
        CampaignModel,
        context.userId,
        filterBy,
        searchQuery,
        pageInfo,
        orderBy,
        otherFilters
      );
      return {
        data: paginatedResult.documents,
        pageInfo: paginatedResult.pageInfo,
      };
      // const allCampaigns = await new CampaignModel({campaignName:args.searchQuery});
      // const res = allCampaigns.viewCampaigns();
      // if(res){
      //   return res
      // }else{
      //   return null
      // }
    } catch (err) {
      throw new Error(err.message);
    }
  }, 
  async getAllCampaignOrders(obj, args, context, info) {
    try {
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const {
        searchQuery,
        sortBy,
        orderBy,
        filterBy,
        limit,
        pageNumber,
        startCursor,
        endCursor,
      } = args;
      const pageInfo = {
        pageNumber,
        startCursor,
        endCursor,
        limit,
        sortBy,
      };
      const otherFilters={"paymentStatus":true}
      const paginatedResult = await getPaginatedData(
        CampaignModel,
        context.userId,
        filterBy,
        searchQuery,
        pageInfo,
        orderBy,
        otherFilters
      );
      return {
        data: paginatedResult.documents,
        pageInfo: paginatedResult.pageInfo,
      };
      // const allCampaigns = await new CampaignModel({campaignName:args.searchQuery});
      // const res = allCampaigns.viewCampaigns();
      // if(res){
      //   return res
      // }else{
      //   return null
      // }
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async getSingleCampaign(obj, args, context, info) {
    try {
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const singleCampaigns = await new CampaignModel({ _id: args.campaignId });
      const res = singleCampaigns.viewSingleCampaign();
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
