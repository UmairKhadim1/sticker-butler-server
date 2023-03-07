import { SegmentModel } from '../../models/segment.model';
import stringUtils from '../../utils/stringUtils';

const segmentsMutations = {
  async createSegment(parent, args, context, info) {
    try {
      const { name, createdBy, conditions,csvUrl,customers } = args.input;
      const Segment = new SegmentModel({
        _id: stringUtils.generateUuidV4(),
        name,
        conditions,
        csvUrl,
        customers,
        createdBy: context.userId,
      });
      const newSegment = await Segment.createSegment();
      return newSegment;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async updateSegment(parent, args, context, info) {
    try {
      const { segmentId, name, conditions,csvUrl,customers } = args.input;
      const Segment = new SegmentModel({
        _id: segmentId,
        name,
        csvUrl,
        customers,
        conditions,
        createdBy: context.userId,
      });
      const updatedSegment = await Segment.updateSegment();
      return updatedSegment;
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async deleteSegment(parent, args, context, info) {
    try {
      const { segmentId } = args.input;
      const Segment = new SegmentModel({
        _id: segmentId,
        createdBy: context.userId,
      });
      const deletedSegment = await Segment.deleteSegment();
      return deletedSegment;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};

export default segmentsMutations;
