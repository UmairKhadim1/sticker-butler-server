import { gql } from 'apollo-server-express';

export default gql`
  type Customer {
    id: ID!
    email: String
    accepts_marketing: Boolean
    first_name: String!
    last_name: String!
    orders_count: String
    state: String
    total_spent: Float
    last_order_id: String
    note: String
    verified_email: Boolean
    multipass_identifier: String
    phone: String
    tags: String
    last_order_name: String
    currency: String
    addresses: [ShopifyAddress]
    accepts_marketing_updated_at: String
    marketing_optInLevel: String
    sms_marketing_consent: String
    admin_graphql_apiId: String
    default_address: ShopifyAddress
    created_at: String
    updated_at: String
    last_order :Order
  }

  type ShopifyAddress {
    id: ID!
    customer_id: String
    first_name: String
    last_name: String
    company: String
    address1: String
    address2: String
    city: String
    province: String
    country: String
    zip: String
    phone: String
    name: String
    province_code: String
    country_code: String
    country_name: String
    default: Boolean
  }

  type Query {
    getCustomer(customerId: String): Customer
    getCustomers: Customer
  }
`;
