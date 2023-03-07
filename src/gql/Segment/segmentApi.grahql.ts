import { gql } from 'apollo-server-express';

export const userGraphqlQuery = {
  getSegments: gql`
    query {
      getSegments(
        filterBy: "name"
        name: "2234324"
        orderBy: "_id"
        sortBy: 1
        limit: 10
        pageNumber: 1
      ) {
        data {
          name
          conditions {
            constraint
          }
        }
        pageInfo {
          totalCount
          previousPageCursor
          nextPageCursor
          pageNumber
        }
      }
    }
  `,
};

export default userGraphqlQuery;
