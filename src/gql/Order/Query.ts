import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ShopModel } from '../../models/shopify.model';
import stringUtils from '../../utils/stringUtils';
import getShopifyOrders from '../../utils/getShopifyOrders';

export default {
  async getOrders(obj, args, context, info) {
    try {
      if (!context.userId) {
        throw new AuthenticationError('Authentication Error');
      }
      const user = await stringUtils.getUserById(context.userId);
      if (!user) return false;
      let selector = {};
      selector['createdBy'] = context.userId;

      const allShops =  new ShopModel(selector);
      const res = await allShops.getShops();
      if (res) {
        const shop = res[0];

        let shopifyOrdres = await getShopifyOrders(shop.name, shop.accessToken);
        if(shopifyOrdres){
          const data=JSON.parse(shopifyOrdres)
          console.log("data",data)
          return data.orders;
        }
      }

      // return [
      //   {
      //     id: '450789469',
      //     contact_email: 'bob.norman@hostmail.com',
      //     created_at: '2008-01-10T11:00:00-05:00',
      //     currency: 'USD',
      //     discount_codes: [
      //       {
      //         code: 'TENOFF',
      //         amount: '10.00',
      //         type: 'fixed_amount',
      //       },
      //     ],
      //     customer: {
      //       id: 207119551,
      //       email: 'bob.norman@hostmail.com',
      //       accepts_marketing: false,
      //       created_at: '2022-01-06T16:21:46-05:00',
      //       updated_at: '2022-01-06T16:21:46-05:00',
      //       first_name: 'Bob',
      //       last_name: 'Norman',
      //       orders_count: 1,
      //       state: 'disabled',
      //       total_spent: '199.65',
      //       last_order_id: 450789469,
      //       note: null,
      //       verified_email: true,
      //       multipass_identifier: null,
      //       tax_exempt: false,
      //       phone: '+16136120707',
      //       tags: '',
      //       last_order_name: '#1001',
      //       currency: 'USD',
      //       accepts_marketing_updated_at: '2005-06-12T11:57:11-04:00',
      //       marketing_opt_in_level: null,
      //       tax_exemptions: [],
      //       admin_graphql_api_id: 'gid://shopify/Customer/207119551',
      //       default_address: {
      //         id: 207119551,
      //         customer_id: 207119551,
      //         first_name: null,
      //         last_name: null,
      //         company: null,
      //         address1: 'Chestnut Street 92',
      //         address2: '',
      //         city: 'Louisville',
      //         province: 'Kentucky',
      //         country: 'United States',
      //         zip: '40202',
      //         phone: '555-625-1199',
      //         name: '',
      //         province_code: 'KY',
      //         country_code: 'US',
      //         country_name: 'United States',
      //         default: true,
      //       },
      //     },

      //     email: 'bob.norman@hostmail.com',
      //     name: '#1001',
      //     number: 1,
      //     order_number: 1001,
      //     phone: '+557734881234',
      //     subtotal_price: '597.00',
      //     total_discounts: '10.00',
      //     total_price: '598.94',
      //     total_tax: '11.94',
      //     billing_address: {
      //       first_name: 'Bob',
      //       address1: 'Chestnut Street 92',
      //       phone: '555-625-1199',
      //       city: 'Louisville',
      //       zip: '40202',
      //       province: 'Kentucky',
      //       country: 'United States',
      //       last_name: 'Norman',
      //       address2: '',
      //       company: null,
      //       latitude: 45.41634,
      //       longitude: -75.6868,
      //       name: 'Bob Norman',
      //       country_code: 'US',
      //       province_code: 'KY',
      //     },
      //     discount_applications: [
      //       {
      //         target_type: 'line_item',
      //         type: 'discount_code',
      //         value: '10.0',
      //         value_type: 'fixed_amount',
      //         allocation_method: 'across',
      //         target_selection: 'all',
      //         code: 'TENOFF',
      //       },
      //     ],
      //     shipping_address: {
      //       first_name: 'Bob',
      //       address1: 'Chestnut Street 92',
      //       phone: '555-625-1199',
      //       city: 'Louisville',
      //       zip: '40202',
      //       province: 'Kentucky',
      //       country: 'United States',
      //       last_name: 'Norman',
      //       address2: '',
      //       company: null,
      //       latitude: 45.41634,
      //       longitude: -75.6868,
      //       name: 'Bob Norman',
      //       country_code: 'US',
      //       province_code: 'KY',
      //     },
      //   },
      // ];
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async getOrder(obj, args, context, info) {
    try {
      return {
        id: '450789469',
        contact_email: 'bob.norman@hostmail.com',
        created_at: '2008-01-10T11:00:00-05:00',
        currency: 'USD',
        discount_codes: [
          {
            code: 'TENOFF',
            amount: '10.00',
            type: 'fixed_amount',
          },
        ],
        customer: {
          id: 207119551,
          email: 'bob.norman@hostmail.com',
          accepts_marketing: false,
          created_at: '2022-01-06T16:21:46-05:00',
          updated_at: '2022-01-06T16:21:46-05:00',
          first_name: 'Bob',
          last_name: 'Norman',
          orders_count: 1,
          state: 'disabled',
          total_spent: '199.65',
          last_order_id: 450789469,
          note: null,
          verified_email: true,
          multipass_identifier: null,
          tax_exempt: false,
          phone: '+16136120707',
          tags: '',
          last_order_name: '#1001',
          currency: 'USD',
          accepts_marketing_updated_at: '2005-06-12T11:57:11-04:00',
          marketing_opt_in_level: null,
          tax_exemptions: [],
          admin_graphql_api_id: 'gid://shopify/Customer/207119551',
          default_address: {
            id: 207119551,
            customer_id: 207119551,
            first_name: null,
            last_name: null,
            company: null,
            address1: 'Chestnut Street 92',
            address2: '',
            city: 'Louisville',
            province: 'Kentucky',
            country: 'United States',
            zip: '40202',
            phone: '555-625-1199',
            name: '',
            province_code: 'KY',
            country_code: 'US',
            country_name: 'United States',
            default: true,
          },
        },

        email: 'bob.norman@hostmail.com',
        name: '#1001',
        number: 1,
        order_number: 1001,
        phone: '+557734881234',
        subtotal_price: '597.00',
        total_discounts: '10.00',
        total_price: '598.94',
        total_tax: '11.94',
        billing_address: {
          first_name: 'Bob',
          address1: 'Chestnut Street 92',
          phone: '555-625-1199',
          city: 'Louisville',
          zip: '40202',
          province: 'Kentucky',
          country: 'United States',
          last_name: 'Norman',
          address2: '',
          company: null,
          latitude: 45.41634,
          longitude: -75.6868,
          name: 'Bob Norman',
          country_code: 'US',
          province_code: 'KY',
        },
        discount_applications: [
          {
            target_type: 'line_item',
            type: 'discount_code',
            value: '10.0',
            value_type: 'fixed_amount',
            allocation_method: 'across',
            target_selection: 'all',
            code: 'TENOFF',
          },
        ],
        shipping_address: {
          first_name: 'Bob',
          address1: 'Chestnut Street 92',
          phone: '555-625-1199',
          city: 'Louisville',
          zip: '40202',
          province: 'Kentucky',
          country: 'United States',
          last_name: 'Norman',
          address2: '',
          company: null,
          latitude: 45.41634,
          longitude: -75.6868,
          name: 'Bob Norman',
          country_code: 'US',
          province_code: 'KY',
        },
      };
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
