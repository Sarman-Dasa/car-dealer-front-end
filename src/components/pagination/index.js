import React from "react";
import { Pagination } from "react-bootstrap";

export default function MyPagination({
  totalCount,
  perPage,
  currentPage,
  handlePageChange,
}) {
  const totalPageNumber = Math.ceil(totalCount / perPage);
  return (
    <div className="float-end">
      {
        <Pagination className="px-4">
          {Array.from({ length: totalPageNumber }).map((_, index) => {
            return (
              <Pagination.Item
                onClick={() => handlePageChange(index + 1)}
                key={index + 1}
                active={index + 1 === currentPage}
              >
                {index + 1}
              </Pagination.Item>
            );
          })}
        </Pagination>
      }
    </div>
  );
}
