export const getPagination = (
  totalRecords: number,
  skip: number,
  limit: number,
) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / limit);

  // Adjust the skip value if it exceeds the total records
  if (skip >= totalRecords) {
    skip = Math.max(0, (totalPages - 1) * limit);
  }

  // Calculate current page based on adjusted skip
  const currentPage = Math.floor(skip / limit) + 1;

  // Determine next page if it exists
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  // Determine previous page if it exists
  let previousPage = currentPage > 1 ? currentPage - 1 : null;

  // Pagination metadata
  return {
    totalRecords,
    totalPages,
    currentPage,
    nextPage,
    previousPage,
    limit,
    skip,
  };
};
