import { gql } from 'apollo-server-express';


export  const  AddressAPIs = {
      addNewAddress :gql `
                mutation addNewAddress( $address1:String! $address2:String
                            $city:String! $state:String! $zipCode:String!){
                addAccountAddressBookEntry(input:
                    { 
                        address1:$address1,address2:$address2,
                        city:$city,state:$state,zipCode:$zipCode
                    })
                    {
                status
                message
                }
            }
          `,
    updateAddress:gql `
              mutation updateAddress($id: String! $address1: String! $address2: String 
                          $city: String! $state: String! $zipCode: String!){
                    updateAccountAddressBookEntry(input:{ _id:$id,
                    address1:$address1,address2:$address2,
                    city:$city,state:$state,zipCode:$zipCode
                    }){
                    status
                    message
                    }
                }
               `,

      deleteAddress:  gql `
                mutation deleteAddress($id:String!){
                    deleteAccountAddressBookEntry(input:{ _id:$id }){
                    status
                    message
                    }
                }
            ` ,     
}

