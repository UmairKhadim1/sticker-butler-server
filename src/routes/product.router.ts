/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult, errors } = require('express-validator/check');
const ProductModel = require('../models/product.model');
const CategoryModel = require('../models/category.model');

/**
 * !Multer Config
 */
const storage = multer.diskStorage({
  destination: './public/uploads/Product_Images/',
  filename(req, file, cb) {
    cb(null, `IMAGE-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
}).single('img');
const productRouter = express.Router();
productRouter.use((req, res, next) => {
  console.log('====================================');
  console.log('Product Router ');
  console.log('====================================');
  next();
});

/**
 *
 */

const productHelpers = {
  productExist: (name) => new Promise((resolve, reject) => {
    ProductModel.findOne({ name }, (err, document) => {
      if (err) return reject(false);
      if (document) {
        return resolve(document);
      }

      return resolve(false);
    });
  }),
};

/**
 *INSERT
 */

productRouter.post('/insert',
// [body('name').not().isEmpty().withMessage('Product Name is required...')],
  (req, res) => {
    const errorsArray = validationResult(req);
    if (!errorsArray.isEmpty()) {
      return res.status(422).jsonp(errorsArray.array());
    }
    productHelpers.productExist(req.body.name).then((exist) => {
      if (exist) return res.status(422).json({ success: true, data: exist, message: 'product already exist' });
      upload(req, res, (err) => {
        if (req.file && req.file.path !== undefined) {
          // const {
          //   path, originalname, destination, filename, size, mimetype,
          // } = req.file;
          req.body.img = req.file.path;
          const {
            cat, name, img, price,
          } = req.body;
          const newProduct = new ProductModel({
            name, img, price, cat,
          });
          CategoryModel.findOne({ name: cat }, (err, category) => {
            if (err) return res.status(500).json({ success: false });
            category.products.push(newProduct);
            category.save((err) => {
              if (err) {
                return res.status(500).json({ success: true, data: err, message: 'failed to insert product' });
              }
              newProduct.save((e, product) => {
                if (e) return res.status(500).json({ success: true, data: err, message: 'failed to insert product' });
                product.img = process.env.SERVER_DOMAIN + product.img;
                return res.status(200).json({ success: true, data: product, message: 'product inserted successfully' });
              });
            });
          });
        } else {
          return res.status(422).json({ success: true, message: 'Product Image is required...' });
        }
      });
    }).catch((error) => {
      console.log('====================================');
      console.log('Error==>', error);
      console.log('====================================');
      return res.status(500).json({ success: true, data: error, message: 'failed to insert product' });
    });
  });

/**
 *GET ALL
 */

// productRouter.get('/all_products', (req, res, next) => {
//   console.log('====================================');
//   console.log('product/all_products');
//   console.log('====================================');
//   const { name, img } = req.body;
//   const allProducts = [];
//   ProductModel.find({}, (err, dbProducts) => {
//     if (err) return res.status(500).json({ success: true, data: err, message: 'failed to get all categories' });
//     dbProducts.forEach((product) => {
//       allProducts.push({ _id: product._id, name: product.name, img: process.env.SERVER_DOMAIN + product.img });
//     });
//     res.status(200).json({ categories: allProducts });
//   });
// });

productRouter.get('/all_products',
//   passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }

    ProductModel.find({}, (err, products) => {
      if (err) res.status(500).json({ message: 'Failed to fetch all categories', success: false, data: err });
      else {
        const allProducts = [];
        if (products !== undefined) {
          products.forEach((product) => {
            allProducts.push(product);
          });
        }
        return res.status(201).json({ message: 'All Products from database ', success: true, data: allProducts });
      }
    });
  });

productRouter.get('/get-products-by-category',
//   passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    const categoryId = req.query.id;
    CategoryModel.findOne({ _id: categoryId }, (err, products) => {
      if (err) res.status(500).json({ message: 'get-products-by-category --failed', success: false, data: err });
      else {
     
        if (products.products.length > 0) {
          return res.status(201).json({ message: 'get-products-by-category --success ', success: true, data: products.products });
        }

        return res.status(201).json({ message: 'get-products-by-category --success ', success: true, data: [] });
      }
    });
  });
module.exports = productRouter;
export {};
