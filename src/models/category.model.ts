/* eslint-disable no-bitwise */
/* eslint-disable max-classes-per-file */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
import {
  DocumentType,
  getModelForClass,
  prop,
} from '@typegoose/typegoose';
import multer from 'multer'
import path from 'path'
import _ from 'lodash';

export const categoryImageStoragePath = './public/uploads/category_images/';

export const categoryImageStorage = multer.diskStorage({
  destination: categoryImageStoragePath,
  filename(req, file, cb) {
    cb(null, `category_image_${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const uploadCategoryImage = multer({
  storage: categoryImageStorage,
  limits: { fileSize: 1000000 },
}).single('img');


export const userRoleEnums = Object.freeze({
  isAdmin: 'admin',
  isUser: 'user',
});

export class Category {

  @prop({ required: true, unique: true })
  public name: string;

  @prop({ required: false, default: 0 })
  public itemCounts?: number;


}
export const CategoryModel = getModelForClass(Category);
export type CategoryDoc = DocumentType<Category>;
export type CategoryId = string;
