/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-const */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
import anyTest from 'ava';
import request from 'supertest';
import {
  LessgoTestInterface,
  testSetup,
  commonHeaders,
  TestUserId,
  authAs,
} from './setup';
import testUserMutations from './data/user/mutatioms';
import { UserModel } from '../models/users.model';

const test = anyTest as LessgoTestInterface;

testSetup(test);

test.serial('can stub authentication by get user ', async t => {
  const { app } = t.context;
  const agent = request(app);
  const query = `query{
 getUser{
   _id
   name
 }
}`;
  authAs(TestUserId.Anna);
  const res = await agent
    .post(`/graphql`)
    .send({
      query,
    })
    .set(commonHeaders);
  t.is(res.status, 200);
});

test.serial('can signup', async t => {
  const { app } = t.context;
  const agent = request(app);
  const query = testUserMutations.createUser();
  const variables = {
    name: 'ahmed',
    email: 'ahmed@ahmed.com',
    password: 'password',
    confirmPassword: 'password',
  };
  const res = await agent.post(`/graphql`).send({
    query,
    variables,
  });
  t.is(res.status, 200);
});

test.serial('can signin', async t => {
  const { app } = t.context;
  const agent = request(app);
  const query = testUserMutations.loginUser();
  const anna = await UserModel.findById(TestUserId.Anna);
  const variables = {
    email: anna.email,
    password: 'anna',
  };
  const res = await agent.post(`/graphql`).send({
    query,
    variables,
  });
  t.is(res.status, 200);
  t.is(res.body.data.loginUser.user._id, anna._id);
  t.is(res.body.data.loginUser.user.name, anna.name);
  t.is(res.body.data.loginUser.user.email, anna.email);
  t.truthy(res.body.data.loginUser.tokens.accessToken);
  t.truthy(res.body.data.loginUser.tokens.refreshToken);
});

test.todo('can reset password');
test.todo('can update password');
