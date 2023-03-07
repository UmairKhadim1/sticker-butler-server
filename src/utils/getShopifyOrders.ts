var request = require('request');
export default function getShopifyOrders(shop: string, token: string) {
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: `https://${shop}/admin/api/2022-01/orders.json`,
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
