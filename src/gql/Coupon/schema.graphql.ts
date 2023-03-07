import { gql } from 'apollo-server-express';

export default gql`
  type Coupon {
    _id: ID!
    storeId: ID!
    createdAt: String
    updatedAt: String
  }

  type Query {
    getCoupon: Coupon
  }
`;
