
import { gql } from 'apollo-server-express';

export default gql` 
type shop {
id: ID!
scope: String!,
createdAt:String!
updatedAt:String!
name:String!
}
type Mutation {
    connect(input:connectStoreInput):shop!
}
input connectStoreInput{
    shop:String!
    code:String!
    state:String!
    hmac:String!
}
type Query {
    getShops:[shop]
}
`