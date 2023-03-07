const StringtoBase64 = data => Buffer.from(data).toString('base64');
const base64toString = data => Buffer.from(data, 'base64').toString('ascii');

const getPaginatedData = async (
  Model,
  createdBy,
  filterBy?,
  dbFilterValue?,
  pageInfo?,
  orderBy?: string,
  otherFilters?
) => {
  const query = {};
  if (dbFilterValue) {
    query[filterBy] = { $regex: dbFilterValue, $options: 'i' };
  }
  otherFilters &&
    Object.keys(otherFilters).map(key => {
      query[key] = otherFilters[key];
    });
  query['createdBy'] = createdBy;
  // if (pageInfo.cursor) {
  //   query['_id'] = {
  //     $lt: base64toString(pageInfo.cursor),
  //   };
  // }
  if (pageInfo.startCursor) {
    query['_id'] = {
      $lt: base64toString(pageInfo.endCursor),
    };
  }
  if (pageInfo.startCursor) {
    query['_id'] = {
      $gt: base64toString(pageInfo.startCursor),
    };
  }
  // console.log('Model', Model);
  // console.log('filterBy', filterBy);
  // console.log('dbFilterValue', dbFilterValue);
  // console.log('pageInfo', pageInfo);
  // console.log('orderBy', orderBy);

  // const pageNumber = pageInfo.page * 1 || 1;
  // const limit = pageInfo.limit * 1 || 10;
  // const skip = (pageNumber - 1) * limit;
  let sort = {};
  if (orderBy) {
    sort[orderBy] = orderBy ? (pageInfo.sortBy == 'desc' ? -1 : 1) : -1;
  } else {
    sort['updatedAt'] = -1;
  }

  let documents = dbFilterValue
    ? await Model.find(query)
        .sort(sort)
        .limit(pageInfo.limit + 1)
    : await Model.find(query)
        .sort(sort)

        .limit(pageInfo.limit + 1);
  const hasNextPage = documents.length > pageInfo.limit;
  // console.log('nextPageFound', hasNextPage);
  documents = hasNextPage ? documents.slice(0, -1) : documents;
  // console.log('paginated documents', documents);
  let totalDocuments = await Model.countDocuments();
  let pageNumber = pageInfo.pageNumber;
  return {
    documents,
    pageInfo: {
      previousPageCursor:
        documents.length > 0 && documents[0]._id
          ? StringtoBase64(documents[0]._id)
          : null,
      nextPageCursor:
        hasNextPage && documents.length > 0
          ? StringtoBase64(documents[documents.length - 1]._id)
          : null,
      hasNextPage,
      totalCount: totalDocuments,
      pageNumber,
    },
  };
};

export default getPaginatedData;
