"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PAGINATION_DOTS } from "@/lib/pagination";

function PaginationButton({
  children,
  disabled = false,
  active = false,
  onClick,
  className = "",
  ariaLabel,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "border-[#0A4A4A] bg-[#0A4A4A] text-white"
          : "border-[#E6ECEA] bg-white text-[#183534] hover:border-[#0A4A4A] hover:text-[#0A4A4A]"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default function PaginationControls({
  pagination,
  onPageChange,
  label = "items",
}) {
  if (!pagination || pagination.totalItems === 0) {
    return null;
  }

  const {
    currentPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    hasPreviousPage,
    hasNextPage,
    pageNumbers,
  } = pagination;

  return (
    <nav
      className="mt-6 flex flex-col gap-3 border-t border-[#EEF2F0] pt-4 sm:flex-row sm:items-center sm:justify-between"
      aria-label={`${label} pagination`}
    >
      <p className="text-sm text-[#7A928D]">
        Showing {startItem}-{endItem} of {totalItems} {label}
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 sm:hidden">
          <PaginationButton
            disabled={!hasPreviousPage}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex-1"
            ariaLabel="Previous page"
          >
            <span className="inline-flex items-center justify-center gap-1">
              <FiChevronLeft aria-hidden />
              Prev
            </span>
          </PaginationButton>

          <div className="min-w-[88px] text-center text-sm font-semibold text-[#5C7571]">
            {currentPage} / {totalPages}
          </div>

          <PaginationButton
            disabled={!hasNextPage}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex-1"
            ariaLabel="Next page"
          >
            <span className="inline-flex items-center justify-center gap-1">
              Next
              <FiChevronRight aria-hidden />
            </span>
          </PaginationButton>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:hidden">
          {pageNumbers.map((pageNumber, index) =>
            pageNumber === PAGINATION_DOTS ? (
              <span
                key={`${pageNumber}-${index}`}
                className="px-1 text-sm font-semibold text-[#9AB0AB]"
                aria-hidden
              >
                {pageNumber}
              </span>
            ) : (
              <PaginationButton
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber)}
                className="min-w-10"
                ariaLabel={`Page ${pageNumber}`}
              >
                {pageNumber}
              </PaginationButton>
            ),
          )}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <PaginationButton
            disabled={!hasPreviousPage}
            onClick={() => onPageChange(currentPage - 1)}
            ariaLabel="Previous page"
          >
            <span className="inline-flex items-center gap-1">
              <FiChevronLeft aria-hidden />
              Previous
            </span>
          </PaginationButton>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {pageNumbers.map((pageNumber, index) =>
              pageNumber === PAGINATION_DOTS ? (
                <span
                  key={`${pageNumber}-${index}`}
                  className="px-1 text-sm font-semibold text-[#9AB0AB]"
                  aria-hidden
                >
                  {pageNumber}
                </span>
              ) : (
                <PaginationButton
                  key={pageNumber}
                  active={pageNumber === currentPage}
                  onClick={() => onPageChange(pageNumber)}
                  className="min-w-10"
                  ariaLabel={`Page ${pageNumber}`}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                >
                  {pageNumber}
                </PaginationButton>
              ),
            )}
          </div>

          <PaginationButton
            disabled={!hasNextPage}
            onClick={() => onPageChange(currentPage + 1)}
            ariaLabel="Next page"
          >
            <span className="inline-flex items-center gap-1">
              Next
              <FiChevronRight aria-hidden />
            </span>
          </PaginationButton>
        </div>
      </div>
    </nav>
  );
}
