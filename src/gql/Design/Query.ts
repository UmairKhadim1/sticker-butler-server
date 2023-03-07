import { UserInputError, AuthenticationError } from 'apollo-server-express';

import { DesignModel } from '../../models/design.model';
import stringUtils from '../../utils/stringUtils';
import getPaginatedData from '../../utils/getPagination';
export default {
  async getDesigns(obj, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      let selector = {};
      selector['createdBy'] = context.userId;
      // const { cursor, sortBy, orderBy, filterBy, designName, limit } = args;
      const {
        designName,
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

      if (designName) {
        selector['name'] = designName;
        var desName = selector['name'];
      }

      const paginatedResult = await getPaginatedData(
        DesignModel,
        context.userId,
        filterBy,
        desName,
        pageInfo,
        orderBy
      );
      return {
        data: paginatedResult.documents,
        pageInfo: paginatedResult.pageInfo,
      };

      // const allDesigns =  new DesignModel(selector);
      // const res = allDesigns.getDesigns();
      // if (res) {
      //   return res;
      // } else {
      //   return null;
      // }
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async getDesignById(obj, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      let selector = {};
      const { designId, designName } = args;
      if (designId) {
        selector['_id'] = designId;
      }

      const allDesigns = new DesignModel(selector);
      const res = allDesigns.getDesign();
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
