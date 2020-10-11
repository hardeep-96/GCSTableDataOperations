import React from "react";
import "./assets/Pagination.css";

const Pagination = ({ pageData, handlePagination }) => {
  return (
    <ul className="pagination">
      <li className={pageData.prev === null ? "disabled" : ""}>
        <span
          className={pageData.prev === null ? "disabled fade" : ""}
          onClick={() => handlePagination(pageData.prev, "prev")}
        >
          &lt;
        </span>
      </li>
      {pageData.pages.map((pg) => (
        <li key={pg}>
          <span
            className={pg === pageData.activePage ? "active" : ""}
            onClick={() => handlePagination(pg)}
          >
            {pg}
          </span>
        </li>
      ))}
      <li className={pageData.next === null ? "disabled" : ""}>
        <span
          href="#0"
          className={pageData.next === null ? "disabled fade" : ""}
          onClick={() => handlePagination(pageData.next, "next")}
        >
          &gt;
        </span>
      </li>
    </ul>
  );
};

export default Pagination;
