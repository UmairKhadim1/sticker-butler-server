import s3FetchURL from '../../utils/s3FetchURL';
export default {
  async csvLocation(parent, args, context, info) {
    if (parent.csvUrl) {
      let signedURL = await s3FetchURL(parent.csvUrl);
      return signedURL;
    } else {
      return null;
    }
  },
};
