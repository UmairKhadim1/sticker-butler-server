import { gql } from 'apollo-server-express';

export default gql`
  type Campaign {
    _id: ID!
    name: String!
    address: Address
    createdAt: String
    updatedAt: String
    trackingData:String
    segment:Segment
    paymentStatus:Boolean
    discountCode:String
    discountCodeId:String
    trackingInterval:Int
    type:String
    design:Design
    createdBy:ID
    price:Money
    step:String
    orderDate:String
    

  }
  type Money {
    amount:String
    currency:String
  }
  type Query {
    getCampaign: Campaign
    getSingleCampaign(campaignId: ID): Campaign
    getAllCampaigns(
      searchQuery: String
      filterBy: String
      cursor: String
      limit: Int
      orderBy: String
      sortBy: sortBy
    ): CampaignFeed
    getAllCampaignOrders(
      searchQuery: String
      filterBy: String
      cursor: String
      limit: Int
      orderBy: String
      sortBy: sortBy
    ): CampaignFeed
  }

  type CampaignFeed {
    data: [Campaign!]
    pageInfo: PageInfo!
  }

  type campaignResponse {
    status: Int!
    message: String!
    step:Int
    campaignData: CampaignResponseData
  }
  
  type deleteCampaignResponse {
    status: Int!
    message: String!
   
  }
  type CampaignResponseData {    _id: ID!

    name: String!
    address: ID
    createdAt: String
    updatedAt: String
    segmentId:ID
    discountCode:String
    discountCodeId:String
    trackingInterval:Int
    type:String
    designId:ID
  }
  type Mutation {
    createCampaign(input: createCampaign): campaignResponse
    updateCampaign(input: updateCampaign): campaignResponse
    deleteCampaign(input: deleteCampaign): deleteCampaignResponse
  }

  input createCampaign {
    campaignName: String!
    addressId: ID!
  }

  input updateCampaign {
    campaignId: ID!
    campaignName: String
    addressId: ID
    segmentId:ID
    trackingInterval:Int
    discountCode:String
    discountCodeId:String
    step:Int
    type:CampaginType
    designId:ID
  }
  enum CampaginType{
    single
  }

  input deleteCampaign {
    campaignId: ID!
  }
`;
