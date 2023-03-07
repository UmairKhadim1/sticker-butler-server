import { gql } from 'apollo-server-express';

export default gql`
  type Order {
    id: ID!
    contact_email: String
    currency: String
    discount_codes: [discountCode]
    customer: Customer
    email: String
    name: String
    user_id: ID
    number: String
    order_number: String
    phone: String
    subtotal_price: Float
    total_discounts: Float
    total_price: Float
    total_tax: Float
    billing_address: ShopifyAddress
    discount_applications: [discountApplication]
    shipping_address: ShopifyAddress
    created_at: String
    updated_at: String
  }

  type discountCode {
    code: String
    amount: Float
    type: String
  }

  type discountApplication {
    target_type: String
    type: String
    value: Float
    value_type: String
    allocation_method: String
    target_selection: String
    code: String
  }

  type Query {
    getOrder(orderId: String): Order
    getOrders: [Order]
  }
  type Mutation {
    checkout(product:productInput!,campignId:ID!,segmentId:ID!):String!
  }
  input productInput{
    name:String!
    amount :String!
    currency:String!
    quantity :Int!
  }
`;
