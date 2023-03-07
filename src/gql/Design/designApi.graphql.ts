import { gql } from 'apollo-server-express';

export const createDesign = gql`
  mutation {
    createDesign(
      input: {
        name: "name"
        mediaURLs: { back: "http://url.here", front: "http://url.here" }
        storeID: "storeId"
      }
    ) {
      name
      createdAt
      updatedAt
      mediaURLs {
        back
        front
      }
    }
  }
`;
export const getDesigns = gql`
  query {
    getDesigns(
      filterBy: "name"
      designName: "na"
      orderBy: "_id"
      sortBy: 1
      limit: 10
    ) {
      data {
        name
      }
      pageInfo {
        totalCount

        nextPageCursor
      }
    }
  }
`;
