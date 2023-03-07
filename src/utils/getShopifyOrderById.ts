var request = require('request');
export default function getShopifyOrderById(shop: string, token: string,order_id:string) {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: `https://${shop}/admin/api/2022-01/orders/${order_id}.json`,
      headers: {
        'X-Shopify-Access-Token': token,
      },
    };
    request(options, function (error, response) {
      if (error) {
          console.log(error)
        reject(error);
      }
      resolve(response.body);
    });
  });
}
