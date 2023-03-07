import { prop } from "@typegoose/typegoose";

interface ICoupon {
    _id:string;
    storedId:string;
}

class Coupon {
@prop({ required: true })
public _id:string;

@prop({ required: true })
public storedId:string;


}