import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import { ForbiddenError } from 'apollo-server-express';

interface ISegment {
  _id: string;
  name: string;
  csvUrl: string;
    conditions: object[];
  customers: number;
}

class Segment {
  @prop({ required: true })
  public _id: string;

  @prop({ required: true })
  public name: string;
  
  @prop({ required: false })
  public customers: number;

  @prop({required: false  })
  public csvUrl: string;

  @prop({ required: true })
  public conditions: object;

  @prop({ required: false })
  public createdBy: string;

  @prop({ required: true, default: Date.now })
  public createdAt: Date;

  @prop({ required: true, default: Date.now })
  public updatedAt: Date;

  public async createSegment() {
    try {
      const newSegment = await SegmentModel.create({
        _id: this._id,
        name: this.name,
        csvUrl: this.csvUrl,
        conditions: this.conditions,
        customers:this.customers,
        createdBy: this.createdBy,
      });
      return {
        status: 200,
        message: 'Segment created successfuly',
        data: newSegment,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  public async getSegments() {
    try {
      const segments = this.name
        ? await SegmentModel.find({ name: this.name })
        : await SegmentModel.find();
      return {
        status: 200,
        message: 'All Segments fetched successfuly',
        data: segments,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async getSegment() {
    try {
      const segment = await SegmentModel.findOne({
        _id: this._id,
        createdBy: this.createdBy,
      });
      return {
        status: 200,
        message: 'Segment fetched successfuly',
        data: segment,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async updateSegment() {
    try {
      const updatedSegment = await SegmentModel.findByIdAndUpdate(
        { _id: this._id },
        {
          name: this.name,
        customers:this.customers,
        csvUrl:this.csvUrl,

          conditions: this.conditions,
        },
        { new: true, runValidators: true }
      );
      return {
        status: 204,
        message: 'Segment updated successfuly',
        data: updatedSegment,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async deleteSegment() {
    try {
      const segment = await SegmentModel.findOneAndRemove({
        _id: this._id,
        createdBy: this.createdBy,
      });
      if (!segment)
        throw new ForbiddenError(
          'Invalid Id Or You Cannot Access this segment'
        );

      return {
        status: 204,
        message: 'Segment deleted successfuly',
        data: null,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export const SegmentModel = getModelForClass(Segment);
export type SegmentDoc = DocumentType<Segment>;
