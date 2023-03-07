import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import s3Delete from "../utils/s3Delete"
interface IDesign {
  _id: string;
  name: string;
  storeId: string;
  mediaURLs: object;
  createdBy: string;
  // conditions:string;
  // customers:string[]
}

export class Design {
  @prop({ required: true })
  public _id: string;

  @prop({ required: true })
  public name: string;

  @prop({})
  public storeId: string;

  @prop({ required: true })
  public createdBy: string;

  @prop({ required: true })
  public mediaURLs: object;

  @prop({ required: true })
  public fileType: object;

  @prop({ required: true, default: Date.now })
  public createdAt: Date;

  @prop({ required: true, default: Date.now })
  public updatedAt: Date;

  // @prop()
  // public conditions:string;

  // @prop({type:()=> [String]})
  // public customers:string[];
  public async getDesign() {
    try {
      const singleDesign = await DesignModel.findOne({ _id: this._id });
      if (singleDesign) {
        return singleDesign;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  public async getDesigns() {
    try {
      const Designs = this.name
        ? await DesignModel.find({ name: this.name ,createdBy:this.createdBy})
        : await DesignModel.find({createdBy:this.createdBy});
      if (Designs) {
        return Designs;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async updateDesign() {
    try {
      const updateDesign = await DesignModel.findByIdAndUpdate({
        _id: this._id,
      });

      if (updateDesign) {
        if (updateDesign.createdBy != this.createdBy) {
          throw new Error("Forbidden");
        }
        if (this.mediaURLs) {
          updateDesign.mediaURLs = this.mediaURLs;
        }
        if (this.name) {
          updateDesign.name = this.name;
        }
        await updateDesign.save();
        return {
          status: 200,
          message: "Design Udated Successfuly",
          data: updateDesign,
        };
      } else {
        throw new Error("Resource don't exist");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async deleteDesign() {
    try {
      const designExsist = await DesignModel.findOne({
        _id: this._id,
        createdBy:this.createdBy,
      });
      console.log("designExsist", designExsist);
      if (designExsist) {
        const deletedDesign = await DesignModel.findByIdAndRemove({
          _id: this._id,
        });
        if (deletedDesign) {
          let frontDetele= await s3Delete(designExsist.mediaURLs.front);
          console.log("frontDetele",frontDetele)
          
          let backDetele= await s3Delete(designExsist.mediaURLs.back);
          console.log("backDetele",backDetele)
          return {
            status: 200,
            message: "Design Deleted Successfuly",
            data: deletedDesign,
          };
        } else {
          throw new Error("Internal Server Error");
        }
      } else {
        return {
          status: 200,
          message: "Design Deleted Successfuly",
          data: designExsist,
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export const DesignModel = getModelForClass(Design);
export type DesignDoc = DocumentType<Design>;
