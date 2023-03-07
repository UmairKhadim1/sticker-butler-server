/* eslint-disable no-underscore-dangle */
// Super important this is imported first
import express from 'express';
import mongoose, { Mongoose } from 'mongoose';
import PromiseRouter from 'express-promise-router';
import http, { IncomingMessage, ServerResponse } from 'http';
import expressJwt from 'express-jwt';
import apolloServer from './graphql';
import apiErrorHanlder from './error/api-error-handler';
import fileUpload from 'express-fileupload';
import config from './config';
// import { MeetupModel } from './models/meetup';
// import apiRouterV3 from './routes/v3';
// import publicBaseRouterV3 from './routes/v3/public';
import logger from './helpers/logger';
import stringUtils from './utils/stringUtils';
import { UserModel } from './models/users.model';
import { uploadFile } from './utils/uploadFile';
import retriveOrderSession from './utils/retrive_sessions';
import bodyParser from 'body-parser';
import crypto from "crypto"
var cors = require('cors');

// import passportConfig from './passport/passport';
// import logger, {
//   setupErrorLogging,
//   setupRequestLogging,
// } from './providers/logger';
// Importing for side effects
// import { UI as bullBoard } from 'bull-board';
// import stream from './providers/stream';
// import linkRouter from './routes/links';
// import publicBaseRouterV1 from './routes/public';
// import facebookBaseRouter from './routes/facebook';
// import { cron } from './queue/queue_provider';
// import appEngineBaseRouter from './routes/ah';
// import imgBaseRouter from './routes/img';
// import webBaseRouter from './routes/web';
// import * as auth from './auth';
// import {
//   errorHandler,
//   handleHttpError,
//   handleMongoError,
//   handleMulterError,
//   ServerError,
// } from './utils/errors';

// This does mean we don't get useful stack traces..
// TODO do we want to re-enable?
if (process.env.NODE_ENV !== 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

export const MONGOOSE_OPTIONS: mongoose.ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

export class EvergreenServer {
  /**
   * Populated by {run}
   */
  app: any;

  /**
   * Populated by {setupMongo}
   */
  mongoose: Mongoose;

  // Returned from app.listen()
  private _server?: http.Server;

  get server(): http.Server {
    // if (this._server == null) throw new ServerError('Run run() first');
    if (this._server == null) throw new Error('Run run() first');
    return this._server;
  }

  // Keeping track of jobs that happen off-thread
  private jobsForLater: Promise<any>[];

  public async letsGo() {
    try {
      await this.setupMongo()
        .then(() => {
          console.log('Mongo Db server started successfully.');
        })
        .catch(err => {
          console.log('Mongo Error =>', err.message);
        });
      // await Promise.all([stream.setupChat(), this.setupExpress()]);
      await this.setupExpress();
      this.setupRoutes();
      await this.run();
    } catch (err) {
      console.log(err.message);
    }
  }

  public async run() {
    // const config = (await import('./config')).default;
    logger.info('Server', `Running in ${process.env.SERVER_ENV} mode`);
    if (!config.port) {
      logger.error('Server', 'Need to set port in config');
    }
    logger.info('Server', `Running Node ${process.version}`);
    this._server = this.app.listen(config.port || process.env.PORT, () => {
      logger.info(
        'Server',
        `Sticker butler server running on 0.0.0.0:${config.port}`
      );
    });
  }

  public async setupExpress() {
    const app = express();
    async function startServer() {
      await apolloServer.start();
      apolloServer.applyMiddleware({ app });
    }
    startServer();
    // const httpserver = http.createServer(app);

    // app.use(
    //   expressJwt({
    //     secret: config.JWT_SECRET_KEY,
    //     algorithms: ['HS256'],
    //     credentialsRequired: false,
    //   })
    // );
    app.use(cors());
    app.use(fileUpload());
    app.use(async (req, res, next) => {
      try {
        if (!req.headers.authorization) {
          return next();
        }
        const token = req.headers.authorization.split(' ')[1];

        if (!token) return next();

        const _id = await stringUtils.getUserIdFromToken(
          token,
          config.JWT_SECRET_KEY
        );
        if (!_id) return res.sendStatus(401);
        const user = await UserModel.findById(_id);
        if (!user) return res.sendStatus(401);
        req.user = user;
        return next();
      } catch (err) {
        console.log('token expired', err);
        return res.sendStatus(401);
      }
    });

    app.post(
      '/api/upload',
      expressJwt({ secret: config.JWT_SECRET_KEY, algorithms: ['HS256'] }),
      async function (req, res, next) {
        try {
          if (!req.user._id) return res.sendStatus(401);
          const { body, files } = req;

          let fileStatus = await uploadFile(
            { userId: req.user._id, ...body },
            files
          );
          res.send(fileStatus);
        } catch (err) {
          console.log('err erere', err);
          return res.send(err);
        }
      }
    );

    app.get('/api/order/success', async (req, res) => {
      console.log("api order access");
      retriveOrderSession(req, res);
    });

    app.get('/api/shop', async (req, res) => {
      console.log("shopify check app ", req.query)
      const { shop } = req.query
      //@ts-ignore
      const isShop = await stringUtils.getShopByName(shop)
      console.log("isShop", isShop)
      res.send({ exist: !!isShop })
    });
    app.get('/api/shopify-link', async (req, res) => {
      console.log("shopify-link app ", req.query)
      const { code, hmac, host, shop } = req.query;
      res.redirect(`${process.env.BASE_URL}/auth/sign-in?code=${code}&hmac=${hmac}&host=${host}&shop=${shop}`)

    });
    app.get('/api/install', async (req, res) => {
      console.log("install app ", req.query)
      let { shop, timestatmp, hmac } = req.query;

      // @ts-ignore
      if (shop?.indexOf("http") == -1) {
        shop = "https://" + shop;
      }
      const redirect_URL = `${shop}/admin/oauth/authorize?client_id=${process.env.Shopify_API_Key}&scope=read_orders,write_price_rules,write_discounts&redirect_uri=${process.env.SHOPIFY_LINK_REDIRECT}&state={nonce}&grant_options[]=value`
      res.redirect(redirect_URL)
    });
    app.post('/api/hooks/customers/data_request', bodyParser.json(

      {
        limit: "50mb",
        verify(req: IncomingMessage, res: ServerResponse, buf: Buffer) {
          //@ts-ignore
          req.textBody = buf.toString();
        }
      }

    ), async (req, res) => {
      console.log("customers/data_request", req.body);
      const  hmac  =req.headers['x-shopify-hmac-sha256']
      // @ts-ignore
      let checkHMAC = req.textBody?crypto.createHmac("sha256", process.env.Shopify_App_Secret).update(req.textBody).digest("base64"):null;
      if (checkHMAC != hmac) {
        res.status(401).send()

      } else {
        res.status(200).send()
      }
    });
    app.post('/api/hooks/customers/redact', bodyParser.json({
      limit: "50mb",
      verify(req: IncomingMessage, res: ServerResponse, buf: Buffer) {
        //@ts-ignore
        req.textBody = buf.toString();
      }
    }
    ), async (req, res) => {
      const  hmac  =req.headers['x-shopify-hmac-sha256']
      // @ts-ignore
      let checkHMAC = req.textBody?crypto.createHmac("sha256", process.env.Shopify_App_Secret).update(req.textBody).digest("base64"):null;
      if (checkHMAC != hmac) {
        res.status(401).send()

      } else {
        res.status(200).send()
      }
    });
    app.post('/api/hooks/shop/redact', bodyParser.json({
      limit: "50mb",
      verify(req: IncomingMessage, res: ServerResponse, buf: Buffer) {
        //@ts-ignore
        req.textBody = buf.toString();
      }
    }
    ), async (req, res) => {
      const  hmac  =req.headers['x-shopify-hmac-sha256'];
      // @ts-ignore
      let checkHMAC = req.textBody?crypto.createHmac("sha256", process.env.Shopify_App_Secret).update(req.textBody).digest("base64"):null;
      console.log("checkHMAC",checkHMAC)

      if (checkHMAC != hmac) {
        res.status(401).send()

      } else {
        res.status(200).send()
      }
    });
    app.get('/api/order/cancel', async (req, res) => {
      console.log('req.query', req.query);

      res.redirect(303, `${process.env.BASE_URL}/order/cancel`);
    });
    app.get('/api/test', (req, res) => {
      res.json({ data: `api working at ${new Date()}` });
    });
    this.app = app;
    // const httpserver = http.createServer(server);

    // server.use((req, res, next) => {
    //   logger.info('Server', ` ${req.method} ${req.originalUrl}`);
    //   return next();
    // });
    // // Needed for gcloud
    // // server.set('trust proxy', true);
    // // server.set('json spaces', 2);
    // // await setupRequestLogging(server);
    // server.use(express.json());
    // server.use(express.urlencoded({ extended: true }));
    // server.use(passport.initialize());
    // // server.use(passport.session());
  }

  public setupRoutes() {
    // Only Firebase-authenticated users are allowed to access anything
    // This may change later when other people can interact with backend,
    // in which case this should be restricted to /api/v1
    const root = PromiseRouter();
    // Link re-router. Ideally would re-write it in dispatch.yaml but impossible
    // root.use('/', linkRouter);
    // root.use('/', appEngineBaseRouter);
    // // Endpoints to support our website -- deprecated now
    // // root.use('/', webBaseRouter);
    // root.use('/admin/bullboard', bullBoard);

    // All of the below routes can be used in websites and need CORS
    // root.use(setCORS);
    // root.use(cors());
    root.use((req, res, next) => {
      // console.log('PASSED:');
      return next();
    });
    // root.use('/', imgBaseRouter);
    // // Some public routes that are not authenticated
    // root.use('/api/v1', publicBaseRouterV1);
    // // Mimicking the fallthrough which doesn't work the same way for non-authenticated
    // root.use('/api/v3', publicBaseRouterV3);
    // // API - newer ones fall back on older ones for missing endpoints
    // root.use('/api/v3', apiRouterV3);
    // // Fallback to /api/v1 if nothing found
    // root.use('/', staticInternalRedirect('/api/v2', '/api/v1'));
    // root.use('/api/v1', apiRouterV1);
    root.get('/rest', (req, res) => {
      res.json({ data: 'api working' });
    });

    // Disabled for now
    // root.use('/api/v1', facebookBaseRouter);
    // TODO later change to Rubens way of error handling
    root.use(apiErrorHanlder);
    // root.use(handleMongoError);
    // root.use(handleHttpError);
    // setupErrorLogging(root);
    // root.use(errorHandler);
    this.app.use(root);
  }

  public async setupMongo(): Promise<Mongoose> {
    try {
      console.log('seting up mongo for ', config.mongoURI);
      // function constructMongoURI() {
      // 	let authString = '';
      // 	if (config.mongoUser && config.mongoPassword) {
      // 		authString = `${config.mongoUser}:${config.mongoPassword}`;
      // 	}
      // }
      this.mongoose = await mongoose.connect(config.mongoURI, MONGOOSE_OPTIONS);
      return this.mongoose;
    } catch (err) {
      console.log('err mongo', err);
    }
  }

  // Only used in worker processes
  // public setupCronJobs() {
  //   // They're long running so don't wait for their setup, no rush
  //   cron
  //     .setupJobs()
  //     .then()
  //     .catch(() => {
  //       logger.error('Failed to set up cron jobs');
  //     });
  // }

  public async stop() {
    await mongoose.disconnect();
    if (this._server) {
      await this._server.close();
    }
  }

  // public runLater() {}

  // public waitUntilJobsDone() {
  //   // TODO implement with BehaviorSubjects or something similar
  // }

  // private cleanJobsForLater() {
  //   // Have a look whether any jobs can get removed
  // }
}

export default new EvergreenServer();
