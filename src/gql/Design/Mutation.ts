import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { DesignModel } from '../../models/design.model';
import stringUtils from '../../utils/stringUtils';
export default {
  async createDesign(parent, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      const {mediaURLs}=args.input;
      const front_type=mediaURLs.front.split(".");
      const back_type=mediaURLs.back.split(".");
    
      let designCreated = await new DesignModel({
        ...args.input,
        createdBy: context.userId,
        fileType:{
          front:front_type&&front_type[front_type.length-1],
          back:back_type&&back_type[back_type.length-1]
        },
        _id: stringUtils.generateUuidV4(),
      });
      await designCreated.save();

      if (designCreated) {
        return {
          status: 200,
          message: 'Design Successfully Created',
          data: designCreated,
        };
      }
      throw new Error('Failed to Create design.');
    } catch (err) {
      throw new Error(err.message);
    }
  },
  async updateDesign(parent, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;

      const { designId, name, mediaURLs } = args.input;
      const updatedDesign = await new DesignModel({
        _id: designId,
        createdBy: context.userId,
        name
     
      });
      const res = updatedDesign.updateDesign();
      if (res) {
        return res;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err)
      throw new Error(err.message);
    }
  },
  async deleteDesign(parent, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;

      const { designId } = args;
      const deleteDesign = await new DesignModel({
        _id: designId,
        createdBy: context.userId,
        // createdBy: "usama"
      });
      const res = deleteDesign.deleteDesign();
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
