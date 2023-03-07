import { gql } from 'apollo-server-express';



export const CampaignAPIs = {
  createNewCampaign: gql `
      mutation createNewCampaign(
          $campName: String!
          $addressId: String!
        ){
          createCampaign(input:{
              campaignName:$campName,
            addressId:$addressId
          }){
            status
            message
            campainId
          }
        }
      `,
      updateCampaign:  gql `
          mutation updateCampaign(
            $campId: String!
          $campName: String
            $addressId: String
          ){
            updateCampaign(input:{
                campId:$campId
                  campaignName:$campName,
                  addressId:$addressId
            }){
              status  
              message
            campainData{
              _id
              campaignName
            }
            }
          }
        `,
        deleteCampaign : gql `
            mutation deleteCampaign(
              $campId: String!
            ){
              deleteCampaign(input:{
                  campId:$campId
              }){
                status
                message
              }
            }
          `,
          viewAllCampaign: gql `
              query getAllCampaigns{
                getAllCampagins{
                  _id
                  campaignName
                }
              }
            `,
          searchCampaign: gql `
              query getAllCampaigns($campName: String){
                getAllCampagins(searchQuery:$campName){
                  _id
                  campaignName
                }
              }
            `,
            singleCampaign : gql `
                query getSingleCampaign($id: String!){
                  getSingleCampagin(campId:$id){
                    _id
                    campaignName
                    addressId
                  }
                }
              `,
   }


 
