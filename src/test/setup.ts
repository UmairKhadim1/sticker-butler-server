/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import sinon from 'sinon';

import { TestInterface } from 'ava';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import server, { MONGOOSE_OPTIONS } from '../server';
import { UserModel } from '../models/users.model';
import userMutations from '../gql/Users/Mutation';
import stringUtils from '../utils/stringUtils';

const mongod = new MongoMemoryServer();

export enum TestUserId {
  Anna = 'fb-anna',
  Bob = 'fb-bob',
  Calum = 'fb-calum',
}

/** * Stubs Start */

export const authAs = (userId: any): Promise<any> =>
  sinon.stub(jwt, 'verify').callsFake(() => Promise.resolve({ _id: userId }));
/** * Stubs End */

async function setupMongo() {
  await mongod.start();
  const uri = await mongod.getUri();
  await mongoose.connect(uri, MONGOOSE_OPTIONS);
}

async function createTestUsers() {
  await UserModel.deleteMany({});
  const { users } = YAML.parse(
    fs.readFileSync(
      path.join(__dirname, '../../src/test/data/user/users.yaml'),
      'utf-8'
    )
  );
  const [anna, bob, calum] = users;
  const fbAnna = new UserModel({ ...anna });
  const fbBob = new UserModel({ ...bob });
  const fbCalum = new UserModel({ ...calum });
  await Promise.all([fbAnna.save(), fbBob.save(), fbCalum.save()]);
}

export function testSetup(test) {
  // https://github.com/avajs/ava/blob/master/docs/recipes/endpoint-testing-with-mongoose.md
  test.before(setupMongo);
  test.before(async t => {
    await server.setupExpress();
    server.setupRoutes();
    await server.run();
  });
  test.after.always(async () => {
    await mongod.stop();
    await server.stop();
  });

  // Stubs need to be reset after each test so `called` etc are accurate
  //   test.before(stubStream);

  test.before(createTestUsers);
  // Just want to reset `called` and `calledWith` etc without changing stubs
  test.afterEach(() => {
    sinon.resetHistory();
  });

  // Bob is logged in by default
  //   test.beforeEach(() => {
  //     authAs('fb-bob');
  //   });

  test.serial.beforeEach(createTestUsers);
  //   test.serial.beforeEach(stubFirebaseDynamicLinks);
  test.serial.before(async t => {
    t.context.app = server.app;
  });
  test.serial.beforeEach(sinon.resetHistory);
}

export type LessgoTestInterface = TestInterface<{
  app: any;
  //   clubId: any;
  //   meetupIds: {
  //     address: string;
  //     place: string;
  //     // pastplace: string;
  //   };
  //   firebaseDynamicLinks: Sinon.SinonStub;
  //   firebaseMessaging: Sinon.SinonStub;
  //   // firebaseAdmin.messaging().send() and .sendMulticast
  //   firebaseMessagingSend: Sinon.SinonStub;
}>;
export const commonHeaders = { Authorization: 'Bearer this-token-isnt-used' };
