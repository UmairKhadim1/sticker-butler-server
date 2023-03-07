import { Address, AddressModel } from "../../models/address.model";
import { UserModel } from "../../models/users.model";
import stringUtils from "../../utils/stringUtils";
export default {

    async  addAccountAddressBookEntry(parent,args,context,info){
        try{
                const user = await stringUtils.getUserById(context.userId);
                if(!user) return false;
              const {address1,address2,city,state,zipCode } =args.input;
                const newAddress= await new AddressModel({
                    _id: stringUtils.generateUuidV4(),
                    address1,address2,city,state,zipCode
                });
                user.addressBook.push(newAddress);
                await user.save();
                if(newAddress){
                    return {
                        status: 200,
                        message: 'Address Added Successfuly',
                      };
                }else{
                    throw new Error ("Address not save")
                }
            }catch(err){
                throw new Error(err.message)
            }
     
    },
    async   updateAccountAddressBookEntry(parent,args,context,info){
       try{
        // const user = await stringUtils.getUserById(context.userId);
        // if(!user) return false;
            const updatedAddress= await AddressModel.updateAddress(context.userId,args.input._id,args.input);
            if(updatedAddress){
            return updatedAddress;
            }else{
                return false ;
            }
       }catch(err){
           throw new Error (err.message)
       }
        
    },

    async   deleteAccountAddressBookEntry(parent,args,context,info){
        try{
            const user = await stringUtils.getUserById(context.userId);
            if(!user) return false;
            const deletedAddress= await AddressModel.deleteAddress(context.userId,args.input._id);
            if(deletedAddress){
               return deletedAddress;
            }else{
                return false ;
            }
        }catch(err){
            throw new Error(err.message)
        }
    }
}