const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import stringUtils from '../../utils/stringUtils';
import { UserInputError, AuthenticationError } from 'apollo-server-express';

export default {
  async checkout(parent, args, context, info) {
    if (!context.userId) {
      throw new AuthenticationError('Authentication Error');
    }
    const user = await stringUtils.getUserById(context.userId);
    if (!user) {
      throw new AuthenticationError('Authentication Error');
    }
    const { product, campignId,segmentId } = args;
    if (!product) {
      throw new Error('Product field is required');
    }
    if (!campignId) {
      throw new Error('campignId is required');
    }
    if (campignId && campignId.length == 0) {
      throw new Error('campignId cannot be null');
    }
    const session = await stripe.checkout.sessions.create({
      // line_items: [product],
      client_reference_id:context.userId+"&"+campignId,
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: getPricingDetail(product.quantity),
          quantity: product.quantity,
        },
      ],
      metadata: {
        campaginId: campignId,
        userId:context.userId,
        segmentId:segmentId
      },
      mode: 'payment',
      success_url: `${process.env.API_URL}/order/success?session_id={CHECKOUT_SESSION_ID}&campaignId=${campignId}&id=${context.userId}`,
      cancel_url: `${process.env.API_URL}/canceled`,
    });
    if (session.url) {
      return session.url;
    }
  },
};
const getPricingDetail = (quantity: number) => {
  let pricePoint = '';
  if (quantity > 0 && quantity <= 250) {
    pricePoint ="price_1KRtZoBInwLjrllGgct26O7q";
  } else if (quantity > 250 && quantity <= 500) {
    pricePoint = "price_1KRuUJBInwLjrllGLLx5815g";
  } else if (quantity > 501 && quantity <= 1000) {
    pricePoint ="price_1KRuV1BInwLjrllGpzYUKNjv";
  } else if (quantity > 1001 && quantity <= 1500) {
    pricePoint = "price_1KRuVLBInwLjrllGnARFrftc";
  } else if (quantity > 1501 && quantity <= 2500) {
    pricePoint = "price_1KRuVoBInwLjrllG8qOaBNCz";
  } else if (quantity > 2501 && quantity <= 5000) {
    pricePoint = "price_1KRuWRBInwLjrllG0N798muu";
  } else if (quantity > 5001 && quantity <= 10000) {
    pricePoint ="price_1KRuXxBInwLjrllGvaZEwi2f";
  } 
  return pricePoint;
};