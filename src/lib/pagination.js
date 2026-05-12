const PAGINATION_DOTS = "...";

function createRange(start, end) {
  const length = end - start + 1;

  return Array.from({ length }, (_, index) => start + index);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getPaginationRange(currentPage, totalPages, siblingCount) {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return createRange(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = siblingCount * 2 + 3;
    const leftRange = createRange(1, leftItemCount);

    return [...leftRange, PAGINATION_DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = siblingCount * 2 + 3;
    const rightRange = createRange(totalPages - rightItemCount + 1, totalPages);

    return [1, PAGINATION_DOTS, ...rightRange];
  }

  const middleRange = createRange(leftSiblingIndex, rightSiblingIndex);

  return [1, PAGINATION_DOTS, ...middleRange, PAGINATION_DOTS, totalPages];
}

export function getPaginationData(
  items = [],
  currentPage = 1,
  itemsPerPage = 10,
  siblingCount = 1,
) {
  const safeItems = Array.isArray(items) ? items : [];
  const safeItemsPerPage =
    Number.isFinite(itemsPerPage) && itemsPerPage > 0
      ? Math.floor(itemsPerPage)
      : 10;
  const totalItems = safeItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeItemsPerPage));
  const safeCurrentPage = clamp(currentPage, 1, totalPages);
  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * safeItemsPerPage;
  const endIndex = Math.min(startIndex + safeItemsPerPage, totalItems);

  return {
    items: safeItems.slice(startIndex, endIndex),
    currentPage: safeCurrentPage,
    totalItems,
    itemsPerPage: safeItemsPerPage,
    totalPages,
    startItem: totalItems === 0 ? 0 : startIndex + 1,
    endItem: endIndex,
    hasPreviousPage: safeCurrentPage > 1,
    hasNextPage: safeCurrentPage < totalPages,
    pageNumbers: getPaginationRange(safeCurrentPage, totalPages, siblingCount),
  };
}

export { PAGINATION_DOTS };
