import { gql } from 'apollo-server-express';

export default gql`
  type Discount {
    id: ID!
    price_rule: PriceRule
    discount_code_creation: discountCodeCreation
    discount_codes: [discountCode]
    message: String
  }

  type PriceRule {
    id: ID
    title: String
    value_type: String
    value: String
    customer_selection: String
    target_type: String
    target_selection: String
    allocation_method: String
    allocation_limit: String
    once_per_customer: String
    usage_limit: String
    starts_at: String
    ends_at: String
    created_at: String
    updated_at: String
  }

  type discountCode {
    id: ID
    price_rule_id: ID
    code: String
    usage_count: String
    created_at: String
    updated_at: String
  }

  type discountCodeCreation {
    id: ID!
    price_rule_id: ID!
    started_at: String
    completed_at: String
    created_at: String
    updated_at: String
    status: String
    codes_count: Int
    imported_count: Int
    failed_count: Int
  }

  type response {
    price_rule_id: ID
    codes: [String]
  }

  type Query {
    getDiscountPriceRules: [PriceRule]
    getDiscountPriceRule(discountPriceRuleId: ID!): PriceRule

    getDiscounts(priceRuleId: ID!): Discount
    getDiscount(priceRuleId: ID!, discountId: ID!): Discount
  }

  type Mutation {
    createDiscountCodePriceRule(input: discountCodePriceRuleInput): response
    updateDiscountCodePriceRule(
      input: updateDiscountCodePriceRuleInput
    ): Discount
    deleteDiscountCodePriceRule(
      input: deleteDiscountCodePriceRuleInput
    ): Discount

    createDiscountCode(input: createDiscountCodeInput): Discount
    updateDiscountCode(input: updateDiscountCodeInput): Discount
    deleteDiscountCode(input: deleteDiscountCodeInput): Discount
  }

  input discountCodePriceRuleInput {
    title: String!
    target_type: String!
    target_selection: String!
    allocation_method: String!
    value_type: String!
    value: String!
    customer_selection: String!
    starts_at: String!
    usage_limit:String
    once_per_customer:Boolean
    discountCode: String!
  }

  input updateDiscountCodePriceRuleInput {
    id: ID!
    title: String
    target_type: String
    target_selection: String
    allocation_method: String
    value_type: String
    value: String
    customer_selection: String
    starts_at: String
  }

  input deleteDiscountCodePriceRuleInput {
    id: ID!
  }

  input createDiscountCodeInput {
    code: String!
  }

  input updateDiscountCodeInput {
    id: ID!
    priceRuleId: ID!
    code: String!
  }

  input deleteDiscountCodeInput {
    id: ID!
    priceRuleId: ID!
  }
`;
