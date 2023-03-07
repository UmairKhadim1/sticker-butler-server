import { prop } from "@typegoose/typegoose";

interface IOrder {
    _id:string;
    storedId:string;

}

class Order  {

@prop({ required: true })
public _id:string;

@prop({ required: true })
public storedId:string;

}