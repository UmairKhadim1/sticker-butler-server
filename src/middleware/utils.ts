// import logger from '../providers/logger';
// import { ServerError } from '../errors';

import logger from '../helpers/logger';

export namespace mid {
  export function serial(...wares: any[]) {
    return wares.reduce((a, b) => {
      return async function (req, res, next) {
        // may throw
        await a(req, res, next);
        await b(req, res, next);
        return Promise.resolve('next');
      };
    });
  }

  export function parallel(...wares: any[]) {
    return async function (req, res, next) {
      const results = await Promise.all(
        wares.map(ware => ware(req, res, next)),
      );
      if (results.some(result => result !== 'next'))
        // throw new ServerError(`Middleware returned non-"next"`);
        throw new Error(`Middleware returned non-"next"`);

      return Promise.resolve('next');
    };
  }
}

export function internalRedirect(
  pattern: string | RegExp,
  rewrite: (req: any, res: any) => string,
) {
  return async function (req, res, next) {
    const target = rewrite(req, res);
    let oldUrl = req.url;
    req.url = req.url.replace(pattern, target);
    if (req.url.match(pattern))
      logger.debug('Middleware', `${oldUrl} -> ${req.url}`);
    return Promise.resolve('route');
  };
}

export function staticInternalRedirect(
  pattern: string | RegExp,
  target: string,
) {
  const rewrite = (req, res) => target;
  return internalRedirect(pattern, rewrite);
}
