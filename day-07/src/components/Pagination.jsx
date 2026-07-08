import React from "react";

function Pagination({
  currentPage,
  totalResults,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalResults / 10);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span className="page-number">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

Pagination.defaultProps = {
  currentPage: 1,
  totalResults: 0,
  onPageChange: () => {},
};

export default Pagination;