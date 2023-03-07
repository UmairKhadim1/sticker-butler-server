/* eslint-disable no-unused-vars */
/* eslint-disable import/no-mutable-exports */
import * as dotenv from 'dotenv';
import * as path from 'path';
import appRoot from 'app-root-path';
import assert from 'assert';

export enum Env {
  Test = 'test',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

const envs = [Env.Test, Env.Development, Env.Staging, Env.Production];

if (!envs.includes(process.env.SERVER_ENV as Env)) {
  // throw new Error("Make sure to set SERVER_ENV")
  process.env.SERVER_ENV = Env.Development;
  console.warn('Falling back to development because SERVER_ENV not set');
}
if ((process.env.SERVER_ENV as Env) == Env.Production) {
  console.info('Configured for PRODUCTION');
}

export function isTest() {
  return process.env.SERVER_ENV == Env.Test;
}
export function isDev() {
  return process.env.SERVER_ENV == Env.Development;
}
export function isStaging() {
  return process.env.SERVER_ENV == Env.Staging;
}
export function isProd() {
  return process.env.SERVER_ENV == Env.Production;
}
// Orthogonal to others: dev/staging/prod can all run on GAE
export function isGAE() {
  return !!process.env.GAE_APPLICATION;
}

if (isGAE()) console.log('Running on Google App Engine baby');

// TODO remove! this is for GAE testing only -- some module needs it, probably Logging
// process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(appRoot.path, 'google-service-account.json');

const domainPrefix = () => {
  if (isDev()) return 'dev';
  if (isStaging()) return 'staging';
  if (isTest()) return 'test';
  if (isProd()) return undefined;
};

const domain = (() => {
  if (isDev()) return 'dev.evergreen.pk';
  if (isStaging()) return 'staging.evergreen.pk';
  if (isTest()) return 'test.evergreen.pk';
  if (isProd()) return 'evergreen.pk';
})();

// Makes some sense to have *.api.evergreen.pk -> routing to app engine is easier
const apiDomain = (() => {
  if (isDev()) return 'dev.api.evergreen.pk';
  if (isStaging()) return 'staging.api.evergreen.pk';
  if (isTest()) return 'test.api.evergreen.pk';
  if (isProd()) return 'api.evergreen.pk';
})();

let dotenvPath;
// TODO(prod) once we have actual production, add an env file here
if (isStaging() && isGAE())
  dotenvPath = path.join(__dirname, '../.staging-env');
if (isStaging() && !isGAE())
  dotenvPath = path.join(__dirname, '../.staging-local-env');
if (isGAE() && isProd()) dotenvPath = path.join(__dirname, '../.prod-env');
if (!isGAE() && isProd())
  dotenvPath = path.join(__dirname, '../.prod-local-env');
if (isGAE() && isDev()) dotenvPath = path.join(__dirname, '../.dev-env');
if (!isGAE() && isDev()) dotenvPath = path.join(__dirname, '../.dev-local-env');
if (isTest()) dotenvPath = path.join(__dirname, '../.test-env');

assert(dotenvPath);

// It's possible to pre-load. Check package.json for example at dev:local
dotenv.config({ path: dotenvPath });

const CREDENTIALS_PATH = path.join(appRoot.path, 'credentials');

// TODO these should all be non-nullable but test environment isn't setting these
let config: {
  JWT_SECRET_KEY: any;
  JWT_FORGOTPASSWORD_SECRET_KEY: any;
  JWT_REFRESH_TOKEN_SECRET_KEY:any;
  // googleCredentials?: any;
  // googleCredentialsPath?: any;
  // googleMapsKey?: any;
  // firebaseCredentials?: any;
  // firebaseClientCredentials?: any;
  // redisURI?: any;
  apiDomain?: any;
  // mailgunKey?: any;
  // mailgunDomain?: any;
  // twilioAccountSid?: any;
  // twilioAuthToken?: any;
  // facebookSecret?: any;
  // sendgridKey?: any;
  port: any;
  mongoURI: any;
  // streamKey?: any;
  // streamSecret?: any;
  // meetupComKey?: any;
  // meetupComSecret?: any;
  Shopify_API_Key:string;
  Shopify_App_Secret:string;
  host?: string;
  domain?: string;
};
if (isTest()) {
  // TODO ideally should be stubbed by the test runner
  config = {
    // These are the only fields that actually make sense outside of test
    host: process.env.HOST,
    port: process.env.PORT,
    mongoURI: process.env.MONGO_URI,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_FORGOTPASSWORD_SECRET_KEY: process.env.JWT_FORGOTPASSWORD_SECRET_KEY,
    JWT_REFRESH_TOKEN_SECRET_KEY:process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    Shopify_API_Key:process.env.Shopify_API_Key,
    Shopify_App_Secret:process.env.Shopify_App_Secret,

  };
} else {
  config = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    host: process.env.HOST,
    port: process.env.PORT,
    mongoURI: process.env.MONGO_URI,
    JWT_FORGOTPASSWORD_SECRET_KEY: process.env.JWT_FORGOTPASSWORD_SECRET_KEY,
    JWT_REFRESH_TOKEN_SECRET_KEY:process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    Shopify_API_Key:process.env.Shopify_API_Key,
    Shopify_App_Secret:process.env.Shopify_App_Secret,
    // googleMapsKey: process.env.MAPS_KEY,
    // streamKey: process.env.STREAM_KEY,
    // streamSecret: process.env.STREAM_SECRET,
    // firebaseCredentials: require(path.join(
    //   CREDENTIALS_PATH,
    //   process.env.FIREBASE_CREDENTIALS,
    // )),
    // firebaseClientCredentials: require(path.join(
    //   CREDENTIALS_PATH,
    //   process.env.FIREBASE_CLIENT_CREDENTIALS,
    // )),
    // googleCredentials: require(path.join(
    //   CREDENTIALS_PATH,
    //   process.env.GOOGLE_CREDENTIALS,
    // )),
    // googleCredentialsPath: path.join(
    //   appRoot.path,
    //   'credentials',
    //   process.env.GOOGLE_CREDENTIALS,
    // ),
    domain,
    apiDomain,
    // redisURI: process.env.REDIS_URI,
    // mailgunKey: process.env.MAILGUN_KEY,
    // mailgunDomain: process.env.MAILGUN_DOMAIN,
    // facebookSecret: process.env.FACEBOOK_SECRET,
    // twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    // twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    // meetupComKey: process.env.MEETUP_COM_KEY,
    // meetupComSecret: process.env.MEETUP_COM_SECRET,
    // sendgridKey: process.env.SENDGRID_KEY,
  };
}

export default config;
