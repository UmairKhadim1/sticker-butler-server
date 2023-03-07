import { gql } from 'apollo-server-express';

export default gql`
  type Segment {
    _id: ID!
    name: String!
    conditions: [Conditions]
    createdBy: String
    createdAt: String
    updatedAt: String
    customers:Int
    csvUrl:String
    csvLocation:String
  }
  type Conditions {
    filter: String!
    constraint: String!
    sign: String
    parameter: String
    customerNumber:Int    filterId:Int
    constraintId:Int

  }

  input ConditionsInput {
    filter: String!
    constraint: String!
    sign: String!
    parameter: String
    customerNumber:Int
    lastOrder:String
    toPrice:String
    filterId:Int
    constraintId:Int
  }
  type Query {
    getSegments(
      filterBy: String
      name: String
      pageNumber: Int
      startCursor: String
      endCursor: String
      limit: Int
      orderBy: String
      sortBy: sortBy
    ): SegmentFeed
    getSegmentById(segmentId: ID!): Segment
  }
  type SegmentFeed {
    data: [Segment!]
    pageInfo: PageInfo!
  }

  type PageInfo {
    previousPageCursor: String
    nextPageCursor: String
    hasNextPage: Boolean
    totalCount: Int
    pageSize: Int
    pageNumber: Int
  }

  type createSegmentResponse {
    status: Int
    message: String
    data: Segment
  }

  type Mutation {
    createSegment(input: createSegmentInput): createSegmentResponse
    updateSegment(input: updateSegmentInput): createSegmentResponse
    deleteSegment(input: deleteSegmentInput): createSegmentResponse
  }

  input createSegmentInput {
    name: String!
    csvUrl:String
    customers:Int
    conditions: [ConditionsInput]!
  }

  input updateSegmentInput {
    segmentId: ID!
    csvUrl:String
    name: String!
    customers:Int
    conditions: [ConditionsInput]!
  }

  input deleteSegmentInput {
    segmentId: ID!
  }
`;
