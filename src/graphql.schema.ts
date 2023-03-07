import { makeExecutableSchema } from '@graphql-tools/schema';
// User Imports
import userSchema from './gql/Users/schema.graphql';
import userResolver from './gql/Users/resolver';
// Address Imports
import addressSchema from './gql/Address/schema.graphql';
import addressResolver from './gql/Address/resolver';
// Segment Imports
import segmentSchema from './gql/Segment/schema.graphql';
import segmentResolver from './gql/Segment/resolver';

// Design Imports
import DesignSchema from './gql/Design/schema.graphql';
import DesignResolver from './gql/Design/resolver';
// Campagin Imports
import CampaginSchema from './gql/Campagin/schema.graphql';
import CampaginResolver from './gql/Campagin/resolver';

// Customer Imports
import CustomerSchema from './gql/Customers/schema.graphql';
import CustomerResolver from './gql/Customers/resolver';

// Order Imports
import OrderSchema from './gql/Order/schema.graphql';
import OrderResolver from './gql/Order/resolver';

// Coupon Imports
import CouponSchema from './gql/Coupon/schema.graphql';
import CouponResolver from './gql/Coupon/resolver';
// Shopify Imports
import ShopifySchema from './gql/Shopify/schema.graphql';
import ShopifyResolver from './gql/Shopify/resolver';

// Discounts Imports
import DsicountSchema from './gql/Discount/schema.graphql';
import DsicountResolver from './gql/Discount/resolver';

export default makeExecutableSchema({
  typeDefs: [
    userSchema,
    addressSchema,
    segmentSchema,
    DesignSchema,
    CampaginSchema,
    CustomerSchema,
    OrderSchema,
    CouponSchema,
    ShopifySchema,
    DsicountSchema,
  ],
  resolvers: [
    userResolver,
    addressResolver,
    segmentResolver,
    DesignResolver,
    CampaginResolver,
    CustomerResolver,
    OrderResolver,
    CouponResolver,
    ShopifyResolver,
    DsicountResolver,
  ],
});
