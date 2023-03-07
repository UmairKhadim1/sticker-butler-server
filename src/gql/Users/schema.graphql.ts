import { gql } from 'apollo-server-express';

export default gql`
  type User {
    _id: ID!
    firstName: String
    lastName: String
    userName: String
    name: String!
    email: String!
    emailAddress: [String]
    password: String!
    confirmPassword: String!
    profilePhoto: String
    isSuspended: Boolean
    emailVerified: Boolean
    addressBook: [Address]
    createdAt: String
    updatedAt: String
  }
  type Viewer {
    _id:ID
    name: String!
    store:String
    email: String!
    userName:String
    profilePhoto: String
    emailVerified: Boolean
    addressBook: [Address]
  }

  type createUserResponse {
    status: Int!
    message: String!
  }

  type loginResults {
    sessionId: String
    tokens: Tokens
    user: Viewer
    status: Int
    message: String
  }

  type Tokens {
    refreshToken: String
    accessToken: String
  }

  type Query {
    getUser: Viewer
    pingServer: String
  }

  type Mutation {
    createUser(input: createUserInput): createUserResponse
    loginUser(input: loginUserInput): loginResults
    logOut(input: logOutUserInput): createUserResponse
    forgotPassword(input: forgotPasswordEmailInput): createUserResponse
    verifiedToken(input: verifyResetPasswordTokenInput): Boolean
    resetPassword(input: resetPasswordInput): createUserResponse
    updateUser(input: updateUserInput): createUserResponse
    deleteUser: createUserResponse
    suspendUser: createUserResponse
    refreshToken(input: refreshTokenInput): loginResults
    VerifyAccount(input: verifyUserInput): createUserResponse
    resendVerifyAccountLink(input: resendVerifyUserInput): createUserResponse
  }

  input createUserInput {
    name: String!
    email: String!
    password: String!
    confirmPassword: String!
  }

  input updateUserInput {
    name: String
    profilePhoto: String
  }

  input loginUserInput {
    email: String!
    password: String!
  }

  input refreshTokenInput {
    accessToken: String!
    refreshToken: String!
  }

  input logOutUserInput {
    refreshToken: String!
  }

  input forgotPasswordEmailInput {
    email: String!
  }

  input verifyResetPasswordTokenInput {
    token: String!
  }

  input verifyUserInput {
    verifyToken: String!
  }

  input resendVerifyUserInput {
    token: String!
  }

  input resetPasswordInput {
    token: String!
    password: String!
    confirmPassword: String!
  }
`;
