const request = require('request');

const shopDiscount = {
  // First Create Price Rules
  getDiscountPriceRules(shop: string, token: string) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'GET',
        url: `https://${shop}/admin/api/2022-01/price_rules.json`,
        headers: {
          'X-Shopify-Access-Token': token,
        },
      };

      try {
        request(options, function (error, response) {
          if (response && response.body) {
            resolve(JSON.parse(response.body));
          } else {
            reject(error);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  getDiscountPriceRule(shop: string, token: string, id) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'GET',
        url: `https://${shop}/admin/api/2022-01/price_rules/${id}.json`,
        headers: {
          'X-Shopify-Access-Token': token,
        },
      };

      try {
        request(options, function (error, response) {
          if (response && response.body) {
            resolve(JSON.parse(response.body));
          } else {
            reject(error);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  createDiscountPriceRules(name, token, data) {
    return new Promise((resolve, reject) => {
      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        body: JSON.stringify({ price_rule: data }),
        url: `https://${name}/admin/api/2022-01/price_rules.json`,
      };

      try {
        request(requestOptions, function (error, response) {
          if (response && response.body) {
            resolve(JSON.parse(response.body));
          } else {
            reject(error);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  updateDiscountPriceRules(name, token, data) {
    return new Promise((resolve, reject) => {
      let requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        body: JSON.stringify({
          price_rule: data,
        }),
        url: `https://${name}/admin/api/2022-01/price_rules/${data.id}.json`,
      };

      try {
        request(requestOptions, function (error, response) {
          if (response && response.body) {
            resolve(JSON.parse(response.body));
          } else {
            reject(error);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  deleteDiscountPriceRules(name, token, id) {
    return new Promise((resolve, reject) => {
      let requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        url: `https://${name}/admin/api/2022-01/price_rules/982778314812.json`,
      };

      try {
        request(requestOptions, function (error, response) {
          if (response && response.body) {
            resolve(JSON.parse(response.body));
          } else {
            reject(error);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  // Then Create Discount codes
  getDiscounts(shop: string, token: string, priceRuleId) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'GET',
        url: `https://${shop}/admin/api/2022-01/price_rules/${priceRuleId}/discount_codes.json
        `,
        headers: {
          'X-Shopify-Access-Token': token,
        },
      };

      try {
        request(options, function (error, response) {
          if (response && response.body) {
            resolve(JSON.parse(response.body));
          } else {
            reject(error);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  getDiscount(shop: string, token: string, data) {
    return new Promise((resolve, reject) => {
      let options = {
        method: 'GET',
        url: `https://${shop}/admin/api/2022-01/price_rules/${data.priceRuleId}/discount_codes/${data.discountId}.json`,
        headers: {
          'X-Shopify-Access-Token': token,
        },
      };

      try {
        request(options, function (error, response) {
          if (response && response.body) {
            resolve(JSON.parse(response.body));
          } else {
            reject(error);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  discountCodeCreation(name, token, data) {
    return new Promise((resolve, reject) => {
      console.log('KKKKKKKKKKKKKKK', data.codes);
      let raw = JSON.stringify({
        discount_codes: data.codes,
      });

      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        body: raw,
        url: `https://${name}/admin/api/2022-01/price_rules/${data.id}/batch.json`,
      };

      try {
        request(requestOptions, function (error, response) {
          if (response && response.body) {
            resolve(JSON.parse(response.body));
          } else {
            reject(error);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  updateDiscountCode(name, token, data) {
    return new Promise((resolve, reject) => {
      let raw = JSON.stringify({
        discount_codes: [
          {
            code: data.code,
          },
        ],
      });
      let requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        body: raw,
        url: `https://${name}/admin/api/2022-01/price_rules/${data.priceRuleId}/discount_codes/${data.id}.json`,
      };

      try {
        request(requestOptions, function (error, response) {
          if (response && response.body) {
            resolve(JSON.parse(response.body));
          } else {
            reject(error);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  deleteDiscountCode(name, token, data) {
    return new Promise((resolve, reject) => {
      let requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        url: `https://${name}/admin/api/2022-01/price_rules/${data.priceRuleId}/discount_codes/${data.id}.json`,
      };

      try {
        request(requestOptions, function (error, response) {
          if (response && response.body) {
            resolve(JSON.parse(response.body));
          } else {
            reject(error);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },
};

export default shopDiscount;
  // bulk delete
  // dodo.map(item => {
        //   var axios = require('axios');
        //   var data = '';

        //   var config = {
        //     method: 'delete',
        //     url: `https://codistan-test.myshopify.com/admin/api/2022-01/price_rules/${item.id}.json`,
        //     headers: {
        //       'X-Shopify-Access-Token':
        //         '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',
        //        },
        //     data: data,
        //   };
        //   queue.push(() =>
        //     axios(config)
        //       .then(function (response) {
        //         console.log(JSON.stringify(response.data));
        //       })
        //       .catch(function (error) {
        //         console.log(error);
        //       })
        //   );
        // });