// ============================================================
// backend/src/utils/pagination.js
// ============================================================

/**
 * Build a Mongoose pagination query from Express request query params.
 *
 * Usage:
 *   const { skip, limit, page, sort } = paginate(req.query);
 *   const results = await Model.find(filter).sort(sort).skip(skip).limit(limit);
 *   const total   = await Model.countDocuments(filter);
 *   res.json(buildResponse(results, total, page, limit));
 */

const DEFAULT_LIMIT = 12;
const MAX_LIMIT     = 100;

/**
 * Parse pagination + sort params from query string.
 * @param {object} query        req.query
 * @param {string} defaultSort  e.g. '-createdAt'
 * @returns {{ page, limit, skip, sort }}
 */
function paginate(query = {}, defaultSort = '-createdAt') {
  const page  = Math.max(1, parseInt(query.page,  10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT)
  );
  const skip  = (page - 1) * limit;

  // Build sort object from ?sortBy=price&order=asc
  let sort;
  if (query.sortBy) {
    sort = { [query.sortBy]: query.order === 'asc' ? 1 : -1 };
  } else {
    sort = defaultSort;
  }

  return { page, limit, skip, sort };
}

/**
 * Build a standardised paginated API response.
 * @param {Array}  data
 * @param {number} total
 * @param {number} page
 * @param {number} limit
 * @returns {object}
 */
function buildResponse(data, total, page, limit) {
  const pages   = Math.ceil(total / limit);
  const hasNext = page < pages;
  const hasPrev = page > 1;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null,
    },
  };
}

/**
 * Apply pagination to an existing Mongoose query and return results.
 * @param {mongoose.Query} mongooseQuery  e.g. Model.find(filter)
 * @param {object}         reqQuery        req.query
 * @param {string}         defaultSort
 */
async function paginateQuery(mongooseQuery, reqQuery = {}, defaultSort = '-createdAt') {
  const { page, limit, skip, sort } = paginate(reqQuery, defaultSort);

  // Clone the query for count (before skip/limit)
  const countQuery = mongooseQuery.model.find(mongooseQuery.getFilter());

  const [data, total] = await Promise.all([
    mongooseQuery.sort(sort).skip(skip).limit(limit),
    countQuery.countDocuments(),
  ]);

  return buildResponse(data, total, page, limit);
}

module.exports = { paginate, buildResponse, paginateQuery };
