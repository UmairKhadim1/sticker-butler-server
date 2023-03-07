import { isGAE, isProd, isStaging } from '../config';
import _ from 'lodash';
import cors from 'cors';

const whitelist = (() => {
  // Only attach stringent origin headers for production and staging
  if ((isProd() || isStaging()) && isGAE()) {
    const whitelist = [];
    if (isProd()) return ['https://evergreen.pk', 'https://go.evergreen.pk'];
    if (isStaging())
      return [
        'https://staging.evergreen.pk',
        'https://staging.go.evergreen.pk',
      ];
  } else {
    // Either dev or prod/staging on local
    return '*';
  }
})();

const corsOptions = {
  origin: (origin, callback) => {
    // !origin allows server-to-server etc
    if (!origin || whitelist == '*' || _.includes(whitelist, origin)) {
      // logger.debug("Allowing origin: %s (whitelist %s)", origin, whitelist)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
};

export const setCORS = cors(corsOptions);
