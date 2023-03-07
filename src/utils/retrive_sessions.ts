const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import { CampaignModel } from "../models/campaign.model";
import { UserModel } from "../models/users.model";
export default async function retriveOrderSession(req, res) {
  console.log("retriving session")
  // if (req.method === 'POST')
   {
    try {
      let updateObj={}
      let updateObjUser={}
      // Create Checkout Sessions from body params.
      const {campaignId,session_id}=req.query;
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const customer = await stripe.customers.retrieve(session.customer);
      if (session) {
        updateObj['_id'] = campaignId;
        updateObj['checkout'] = session;
        updateObj['paymentStatus'] = true;
        updateObj['price'] = {amount:session.amount_total/100,currency:session.currency};
      }
    

      const updatedCampaign = await new CampaignModel(updateObj);
      let resDb = await updatedCampaign.updateCampaign();
      if(resDb){
        res.redirect(303, `${process.env.BASE_URL}/order/success?name=${customer.name}&campaignName=${resDb.campaignData.name}`);
      }
      // res.redirect(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);
   
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } 
  // else {
  //   res.setHeader('Allow', 'POST');
  //   res.status(405).end('Method Not Allowed');
  // }
}