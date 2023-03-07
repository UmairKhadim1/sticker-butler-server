import {
  DocumentType,
  getModelForClass,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Address } from './address.model';
import { UserModel } from './users.model';
import stringUtils from '../utils/stringUtils';
import { UserInputError, AuthenticationError } from 'apollo-server-express';

export interface ICampaign {
  _id: string;
  name: string;
  addressId: string;
}

export class Campaign {
  @prop({ required: true })
  public _id: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public addressId: string;

  @prop({ required: false })
  public trackingInterval: string;

  @prop({ required: false })
  public segmentId: string;

  @prop({ required: false })
  public discountCode: string;

  @prop({ required: false })
  public type: string;

  @prop({ required: false })
  public discountCodeId: string;

  @prop({ required: false })
  public checkout: object;

  @prop({ required: false })
  public customerData: object;

  @prop({ required: false })
  public designId: string;

  @prop({ required: true, default: false })
  public paymentStatus: boolean;

  @prop({ required: false })
  public price: object;

  @prop({ required: false })
  public orderDate: Date;
  
  @prop({ required: false })
  public step: string;

  @prop({ required: true, default: Date.now })
  public createdAt: Date;

  @prop({ required: true })
  public createdBy: String;

  @prop({ required: true, default: Date.now })
  public updatedAt: Date;

  // public  async createNewCampaign(userId:string,campaginData:ICampaign){
  //     try{
  //         const user = UserModel.findOne({_id:userId, isSuspended:false});
  //     if(!user){
  //         throw new AuthenticationError('Invalid User');
  //     }else{
  //         const newCampaign = await CampaignModel.create({
  //              _id:stringUtils.generateUuidV4(),
  //               name:campaginData.name,
  //               addressId:campaginData.addressId,
  //         })
  //          newCampaign.save();
  //          if(newCampaign){
  //              return{
  //                  status:200,
  //                  message:"Campaign Save Successfuly",
  //                  campaignData:newCampaign
  //                }
  //          }else{
  //             throw new Error ("Internal Server Error")
  //          }
  //       }
  //     }catch(error){
  //         throw new Error(error.message)
  //     }
  // }
  public async updateCampaign() {
    try {
      const updateCampaign = await CampaignModel.findByIdAndUpdate({
        _id: this._id,
      });
      if (updateCampaign) {
        if (this.addressId) {
          updateCampaign.addressId = this.addressId;
        }
        if (this.segmentId) {
          updateCampaign.segmentId = this.segmentId;
        }
        if (this.name) {
          updateCampaign.name = this.name;
        }

        if (this.discountCode) {
          updateCampaign.discountCode = this.discountCode;
        }
        if (this.discountCodeId) {
          updateCampaign.discountCodeId = this.discountCodeId;
        }
        if (this.trackingInterval) {
          updateCampaign.trackingInterval = this.trackingInterval;
        }
        if (this.type) {
          updateCampaign.type = this.type;
        }

        if (this.checkout) {
          updateCampaign.checkout = this.checkout;
        }
        if (this.paymentStatus) {
          updateCampaign.paymentStatus = this.paymentStatus;
          updateCampaign.orderDate = new Date();
          
        }
     
        if (this.designId) {
          updateCampaign.designId = this.designId;
        }
        if (this.price) {
          updateCampaign.price = this.price;
        }
        if (this.step&&updateCampaign.step!=5) {
          
          updateCampaign.step =updateCampaign.getStepInfo();
        }
        updateCampaign.save();
        return {
          status: 200,
          message: 'Campaign Updated Successfuly',
          campaignData: updateCampaign,
          step:updateCampaign.step
        };
      } else {
        throw new Error('Internal Server Error');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  private getStepInfo(){
    let step=1;
    if(this.designId){step++};
    if(this.segmentId){step++};
    if(this.type){step++};
    if(this.discountCodeId){step++};

    return step
  }
  
  public async deleteCampaign() {
    try {
      const deleteCampaign = await CampaignModel.findOneAndRemove({
        _id: this._id,
      });
      if (deleteCampaign) {
        return {
          status: 200,
          message: 'Campaign Delete Successfuly',
        };
      } else {
        throw new Error('Internal Server Error');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async viewCampaigns() {
    try {
      if (this.name) {
        const searchByNameCampaign = await CampaignModel.find({
          name: this.name,
        });
        if (searchByNameCampaign.length) {
          return searchByNameCampaign;
        } else {
          return null;
        }
      } else {
        const allCampaigns = await CampaignModel.find();
        if (allCampaigns.length) {
          return allCampaigns;
        } else {
          return null;
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async viewSingleCampaign() {
    try {
      const singleCampaign = await CampaignModel.findOne({ _id: this._id });
      if (singleCampaign) {
        return singleCampaign;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export const CampaignModel = getModelForClass(Campaign);
export type CampaignDoc = DocumentType<Campaign>;
