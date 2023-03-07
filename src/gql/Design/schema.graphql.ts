import { gql } from 'apollo-server-express';

export default gql`
  type Design {
    _id: ID!
    name: String!
    storeID: ID
    createdBy: ID!
    createdAt: String
    updatedAt: String
    fileType:DesignFileType
    conditions: String
    customers: [ID]
    mediaURLs: DesignMediaURL
  }
  type DesignFileType {
    front: String
    back: String
  }
  type DesignMediaURL {
    front: String
    back: String
  }
  type DesignResponseObj {
    status: Int!
    message: String!
    data: Design
  }
  type Query {
    getDesigns(
      designName: String
      filterBy: String
      pageNumber: Int
      startCursor: String
      endCursor: String
      limit: Int
      orderBy: String
      sortBy: sortBy
    ): DesignFeed
    getDesignById(designId: ID): Design
  }

  type DesignFeed {
    data: [Design!]
    pageInfo: PageInfo!
  }

  type Mutation {
    createDesign(input: createDesignInput): DesignResponseObj
    updateDesign(input: updateDesignInput): DesignResponseObj
    deleteDesign(designId: ID): DesignResponseObj
  }

  input DesignMediaURLInput {
    front: String
    back: String
  }

  input updateDesignInput {
    designId: ID
    storeID: ID
    name: String!
    mediaURLs: DesignMediaURLInput
  }
  input createDesignInput {
    storeID: ID
    name: String!
    mediaURLs: DesignMediaURLInput
  }
  
  enum sortBy{
    asc
    desc
  }
`;
