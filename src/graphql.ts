import { ApolloServer } from 'apollo-server-express';

import schema from './graphql.schema';

const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core');

export default new ApolloServer({
  schema,
  context(request) {
    return {
      request,
      userId:
        request.req.user && request.req.user._id ? request.req.user._id : null,
    };
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});
