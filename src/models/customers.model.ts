import { prop } from "@typegoose/typegoose";
import { type } from "os";

interface ICustomers {
_id:string;
storedId:string;
emailAdress:string[]
name:string;
}

class Customers {

 @prop({ required: true })
 public _id:string;

 @prop({ required: true })
 public storedId:string;

 @prop({ type: () => [String] })
 public emailAdress: string[];

 @prop()
 public name:string;

}