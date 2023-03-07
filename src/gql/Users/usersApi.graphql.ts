import { gql } from 'apollo-server-express';

export const userGraphqlQuery = {
  createUserMutation: gql`
    mutation createUserMutation(
      $name: String!
      $email: String!
      $password: String!
      $confirmPassword: String!
    ) {
      createUser(
        input: {
          name: $name
          email: $email
          password: $password
          confirmPassword: $confirmPassword
        }
      ) {
        status
        message
      }
    }
  `,
  userlLoginMutation: gql`
    mutation userLoginMutation($email: String!, $password: String!) {
      loginUser(input: { email: $email, password: $password }) {
        status
        message
        sessionId
        tokens {
          accessToken
          refreshToken
        }
        user {
          firstName
          lastName
        }
      }
    }
  `,
  refreshTokenMutation: gql`
    mutation refreshTokenMutation(
      $accessToken: String!
      $refreshToken: String!
    ) {
      refreshToken(
        input: { accessToken: $accessToken, refreshToken: $refreshToken }
      ) {
        sessionId
        tokens {
          accessToken
          refreshToken
        }
        user {
          firstName
          lastName
        }
      }
    }
  `,
  forgotPasswordMutation: gql`
    mutation forgotPasswordMutation($email: String!) {
      forgotPassword(input: { email: $email }) {
        status
        message
      }
    }
  `,

  resetPasswordMutation: gql`
    mutation resetPasswordMutation(
      $token: String!
      $password: String!
      $confirmPassword: String!
    ) {
      resetPassword(
        input: {
          token: $token
          password: $password
          confirmPassword: $confirmPassword
        }
      ) {
        status
        message
      }
    }
  `,

  updateUserMutation: gql`
    mutation updateUserMutation(
      $name: String
      $profilePhoto: String
    ) {
      updateUser(
        input: {
          name: $name
          profilePhoto: $profilePhoto
        }
      ) {
        status
        message
      }
    }
  `,
  deleteUserMutation: gql`
    mutation deleteUserMutation {
      deleteUser {
        status
        message
      }
    }
  `,
  suspendUserMutation: gql`
    mutation suspendUserMutation {
      suspendUser {
        status
        message
      }
    }
  `,

  logOutUserMutation: gql`
    mutation logOutMutation($refreshToken: String!) {
      logOut(input: { refreshToken: $refreshToken }) {
        status
        message
      }
    }
  `,

  verifyResetTokenMutation: gql`
    mutation verifyResetPasswordToken($token: String!) {
      verifiedToken(input: $token) {
        status
        message
      }
    }
  `,
  verifyUserAccount: gql`
    mutation verifyUserAccount($token: String!) {
      VerifyAccount(input: { verifyToken: $token }) {
        status
        message
      }
    }
  `,

  resendVerifyAccountLink: gql`
    mutation resendVerifyUserAccount($reqToken: String!) {
      resendVerifyAccountLink(input: { token: $reqToken }) {
        status
        message
      }
    }
  `,
};

export default userGraphqlQuery;
