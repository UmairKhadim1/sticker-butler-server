import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';

interface IShop {
  _id: string;
  accessToken: string;
  scope: string;
  name: string;
  createdBy: string;
}

export class Shop {
  @prop({ required: true })
  public _id: string;
  @prop({ required: true })
  public accessToken: string;

  @prop({ required: true })
  public scope: string;

  @prop({})
  public name: string;

  @prop({ required: true })
  public createdBy: string;

  @prop({ required: true, default: Date.now })
  public createdAt: Date;

  @prop({ required: true, default: Date.now })
  public updatedAt: Date;

  public async getShops() {
    try {
      const Shops = await ShopModel.find({ createdBy: this.createdBy });
      if (Shops) {
        return Shops;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export const ShopModel = getModelForClass(Shop);
export type ShopDoc = DocumentType<Shop>;
