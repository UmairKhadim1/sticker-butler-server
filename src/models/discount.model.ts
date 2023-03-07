// import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';

// class Discount {
//   @prop({ required: true })
//   public _id: string;

//   @prop({ required: true })
//   public discountCode: string;

//   @prop({ required: true })
//   public types: string;

//   @prop({ required: true })
//   public value: string;

//   @prop({ required: true })
//   public minimumRequirements: string;

//   @prop({ required: true })
//   public customerEligibilty: string;

//   @prop({ required: true })
//   public usageLimit: string;

//   @prop({ required: true })
//   public startDate: Date;

//   //   @prop({ required: true })
//   //   public startTime: Date;

//   @prop({ required: true })
//   public endtDate: Date;

//   @prop({ required: true, default: Date.now })
//   public createdAt: Date;

//   @prop({ required: true, default: Date.now })
//   public updatedAt: Date;

//   public async createDiscount() {
//     try {
//       const newDiscount = await DiscountModel.create({
//         _id: this._id,
//         discountCode: this.discountCode,
//         types: this.types,
//         value: this.value,
//         minimumRequirements: this.minimumRequirements,
//         customerEligibilty: this.customerEligibilty,
//         usageLimit: this.usageLimit,
//         startDate: this.startDate,
//         endtDate: this.endtDate,
//       });
//       return {
//         status: 200,
//         message: 'Discount created successfuly',
//         data: newDiscount,
//       };
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }
//   public async allDiscounts() {
//     try {
//       const discounts = this.discountCode
//         ? await DiscountModel.find({ discountCode: this.discountCode })
//         : await DiscountModel.find();
//       return {
//         status: 200,
//         message: 'All Discounts fetched successfuly',
//         data: discounts,
//       };
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }

//   public async singleDiscount() {
//     try {
//       const Discount = await DiscountModel.findById(this._id);
//       return {
//         status: 200,
//         message: 'Discount fetched successfuly',
//         data: Discount,
//       };
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }

//   public async updateDiscount() {
//     try {
//       const updatedDiscount = await DiscountModel.findByIdAndUpdate(
//         this._id,
//         {
//           discountCode: this.discountCode,
//           types: this.types,
//           value: this.value,
//           minimumRequirements: this.minimumRequirements,
//           customerEligibilty: this.customerEligibilty,
//           usageLimit: this.usageLimit,
//           startDate: this.startDate,
//           endtDate: this.endtDate,
//         },
//         { new: true, runValidators: true }
//       );
//       return {
//         status: 204,
//         message: 'Discount updated successfuly',
//         data: updatedDiscount,
//       };
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }

//   public async deleteDiscount() {
//     try {
//       const discount = await DiscountModel.findByIdAndDelete(this._id);
//       return {
//         status: 204,
//         message: 'Discount deleted successfuly',
//         data: null,
//       };
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }
// }

// export const DiscountModel = getModelForClass(Discount);
// export type DiscountDoc = DocumentType<Discount>;
