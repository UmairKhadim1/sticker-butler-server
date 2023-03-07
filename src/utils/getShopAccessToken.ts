import { body } from 'express-validator';

var request = require('request');
export default function getShopAccessToken(shop: string, code: string) {
  console.log('connecting to ', shop, ' with ', code, '.......');
  return new Promise((resolve, reject) => {
    var options = {
      method: 'POST',
      url: `https://${shop}/admin/oauth/access_token`,

      body: JSON.stringify({
        client_id: process.env.Shopify_API_Key,
        client_secret: process.env.Shopify_App_Secret,
        code: code,
      }),
      'headers': {
        'Content-Type': 'application/json'}
    };
  
    request(options, function (error, response) {
      if (error) {
        console.log('connection error ', error);
         reject(error);
      }
      resolve(response.body);
    });
  });
}
