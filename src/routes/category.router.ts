/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import { request } from 'http';
import multer from 'multer';
import path from 'path';
import commonMiddlewares from '../middleware/commonMiddlewares';
import { CategoryModel, uploadCategoryImage } from '../models/category.model';

const { body, validationResult, errors } = require('express-validator/check');


const categoryRouter = express.Router();


// const categoryHelpers = {
//   categoryExist: name =>
//     new Promise((resolve, reject) => {
//       CategoryModel.findOne({ name }, (err, document) => {
//         if (err) return reject(false);
//         if (document) {
//           return resolve(document);
//         }

//         return resolve(false);
//       });
//     }),
// };



// categoryRouter.post('/',
//   // commonMiddlewares.ensureRequestBody,
//   // commonMiddlewares.ensureRequestBodyKey('name'),
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // console.log(req.body)
//       // uploadCategoryImage(req, res, err => {
//       //   console.log('req.body', req.body.name);
//       //   console.log('req.file', req.file);

//       // }))

//     }
//     catch (err) {
//   console.log(err.message)
// }
//     // upload(req, res, err => {
//     //   if (err) console.log(err);
//     //   // console.log('====================================');
//     //   console.log('req.file', req.file);
//     //   // console.log('req.file', req.body.img);
//     //   // console.log('req.file', req.body.img.uri);
//     //   // console.log('====================================');
//     //   if (req.file && req.file.path !== undefined) {
//     //     // const {
//     //     //   path, originalname, destination, filename, size, mimetype,
//     //     // } = req.file;
//     //     req.body.img = req.file.path;
//     //     const { name, img } = req.body;
//     //     const newCategory = new CategoryModel({ name, img });
//     //     newCategory.save((err, document) => {
//     //       if (err)
//     //         return res.status(500).json({
//     //           success: true,
//     //           data: err,
//     //           message: 'failed to insert category',
//     //         });

//     //       document.img = process.env.SERVER_DOMAIN + document.img;
//     //       return res.status(200).json({
//     //         success: true,
//     //         data: document,
//     //         message: 'category inserted successfully',
//     //       });
//     //     });
//     //   } else {
//     //     return res.status(422).json({
//     //       success: false,
//     //       message: 'Category Image is required...',
//     //     });
//     //   }
//     // });
 
      
// );

// /**
//  *GET ALL
//  */

// categoryRouter.get('/all_categories', (req, res, next) => {
//   console.log('====================================');
//   console.log('category/all_categories');
//   console.log('====================================');
//   const { name, img } = req.body;
//   const allCategories = [];
//   CategoryModel.find({}, (err, dbCategories) => {
//     if (err)
//       return res.status(500).json({
//         success: true,
//         data: err,
//         message: 'failed to get all categories',
//       });
//     dbCategories.forEach(category => {
//       allCategories.push({
//         _id: category._id,
//         name: category.name,
//         img: process.env.SERVER_DOMAIN + category.img,
//       });
//     });
//     res.status(200).json({
//       success: true,
//       data: allCategories,
//       message: 'all categories fected successfully',
//     });
//   });
// });

// /**
//  *CATEGORY ALREADY EXIST
//  */

// categoryRouter.get('/validate/exist', (req, res, next) => {
//   console.log('====================================');
//   console.log('/validate/exist');
//   console.log('====================================');
//   const { catName } = req.query;
//   CategoryModel.find({ name: catName }, (err, dbCategories) => {
//     if (err)
//       return res.status(500).json({
//         success: true,
//         data: err,
//         message: 'failed to get all categories',
//       });
//     if (dbCategories.length > 0) {
//       res.status(200).json({
//         success: true,
//         data: true,
//         message: `category already exist with name ${catName}`,
//       });
//     } else {
//       res.status(200).json({
//         success: true,
//         data: false,
//         message: `no category exist with name ${catName}`,
//       });
//     }
//   });
// });
export default categoryRouter;
