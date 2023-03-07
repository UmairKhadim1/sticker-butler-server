const testUserMutations = {
  createUser: () => `
mutation createUserMutation(
            $name: String!
            $email: String!
            $password: String!
            $confirmPassword: String!
){
            createUser(input:
              {
                name:$name,
                email:$email,
                password:$password,
                confirmPassword:$confirmPassword
              })
              {
              status
              message
              }
          }
  `,
  loginUser: () => `
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
          name
          email
          _id
        }
      }
    }
  `,
};

export default testUserMutations;
