import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import { UserInputError, AuthenticationError } from 'apollo-server-express';
import config from '../config';
import stringUtils from '../utils/stringUtils';
import { UserModel } from './users.model';

export interface IAddress {
  _id: string;
  // firstName:string;
  // lastName:string
  // fullName:string;
  address1: string;
  address2: string;
  city: string;
  // company:string;
  state: string;
  zipCode: string;
  // phone:string;
  // postal:string;
  // region:string;
  // isBillingDefault:boolean;
  // isShippingDefault:boolean;
  // isCommercial:boolean;
}

export class Address {
  @prop({ required: true })
  public _id: string;

  @prop({ required: true })
  public address1: string;

  @prop()
  public address2: string;

  @prop({ required: true })
  public city: string;

  @prop({ required: true })
  public state: string;

  @prop({ required: true })
  public zipCode: string;

  // @prop()
  // public firstName:string;

  // @prop()
  // public lastName:string;

  // @prop({ required: true })
  // public fullName:string;

  // @prop({ required: true })
  // public country:string;

  // @prop({ required: true })
  // public phone:string;

  // @prop({ required: true })
  // public postal:string;

  // @prop({ required: true })
  // public region:string;

  // @prop()
  // public isBillingDefault:boolean;

  // @prop()
  // public isShippingDefault:boolean;

  // @prop({ required: true })
  // public isCommercial:boolean;

  


  // public  async createNewAddress(userId: string, addressData: IAddress) {
  //   try {
  //     const user = await this.getUserById(userId);
  //     if (!user) {
  //       throw new AuthenticationError('Invalid User');
  //     } else {
  //       const newAddress = new AddressModel({
  //         _id: stringUtils.generateUuidV4(),
  //         ...addressData,
  //       });
  //       user.addressBook.push(newAddress);
  //       await user.save();
  //       return {
  //         status: 200,
  //         message: 'Address Added Successfuly',
  //       };
  //     }
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  public static async updateAddress(
    userId: string,
    addressId: string,
    addressData: IAddress
  ) {
    try {
        const address = await UserModel.findOneAndUpdate(
          { _id: userId, 'addressBook._id': addressId },
          { $set: { "addressBook.$": addressData } }
        );
        if (address) {
          return {
            status: 200,
            message: 'Address Updated Successfuly',
          };
        }
        throw new Error('Internal Server Error');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public static async deleteAddress(userId: string, addressId: string) {
    try {
        const address = await UserModel.findOneAndUpdate(
          { _id: userId },
          { $pull: { addressBook: { _id: addressId } } }
        );
        if (address) {
          return {
            status: 200,
            message: 'Address Deleted Successfuly.',
          };
        }
        throw new Error('Internal Server Error');
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export const AddressModel = getModelForClass(Address);
export type AddressDoc = DocumentType<Address>;
