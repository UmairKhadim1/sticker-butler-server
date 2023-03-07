import { gql } from 'apollo-server-express';

export default gql`
  type Address {
    _id: ID
    address1: String!
    address2: String
    city: String!
    state: String!
    zipCode: String!
    firstName: String
    lastName: String
    phone: String
    province: String
    country: String
    company: String
    latitude: Float
    longitude: Float
    countryCode: String
    provinceCode: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    getAddress: Address
    getAddressByAccountId: [Address]
  }

  type Mutation {
    addAccountAddressBookEntry(
      input: addAccountAddressBookEntryInput
    ): addressBookResult
    updateAccountAddressBookEntry(
      input: updateAccountAddressBookEntryInput
    ): addressBookResult
    deleteAccountAddressBookEntry(
      input: deleteAccountAddressBookEntryInput
    ): addressBookResult
  }
  type addressBookResult {
    status: Int
    message: String
  }

  input addAccountAddressBookEntryInput {
    address1: String!
    address2: String
    city: String!
    state: String!
    zipCode: String!
  }

  input updateAccountAddressBookEntryInput {
    _id: String!
    address1: String!
    address2: String
    city: String!
    state: String!
    zipCode: String!
  }

  input deleteAccountAddressBookEntryInput {
    _id: String!
  }
`;
