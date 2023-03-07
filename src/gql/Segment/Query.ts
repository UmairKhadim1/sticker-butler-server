import { AuthenticationError } from 'apollo-server-core';
import { SegmentModel } from '../../models/segment.model';
import getPaginatedData from '../../utils/getPagination';
import stringUtils from '../../utils/stringUtils';

export default {
  async getSegments(obj, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const {
        name,
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
      const paginatedResult = await getPaginatedData(
        SegmentModel,
        context.userId,
        filterBy,
        name,
        pageInfo,
        orderBy
      );
      return {
        data: paginatedResult?.documents,
        pageInfo: paginatedResult?.pageInfo,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async getSegmentById(obj, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;

      if (
        args.segmentId == '' ||
        (args.segmentId && args.segmentId.length == 0)
      ) {
        throw new Error('Segment id is required');
      }
      const Segment = new SegmentModel({
        _id: args.segmentId,
        createdBy: context.userId,
      });
      const segment = await Segment.getSegment();
      return segment?.data;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
