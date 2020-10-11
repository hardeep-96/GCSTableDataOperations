import React from "react";
import "./assets/Pagination.css";

const Pagination = ({ pageData, handlePagination }) => {
 
  return (
    <ul className="pagination">
      <li
        className={pageData.prev === null ? "disabled" : ""}
        onClick={() => handlePagination(pageData.prev, "prev")}
      >
        <span className={pageData.prev === null ? "disabled fade" : ""}>&lt;</span>
      </li>
      {pageData.pages.map((pg) => (
        <li key={pg} onClick={() => handlePagination(pg)}>
          <span
            className={pg === pageData.activePage ? "active" : ""}
          >
            {pg}
          </span>
        </li>
      ))}
      <li
        className={
          pageData.next === null ? "disabled" : ""
        }
        onClick={() => handlePagination(pageData.next, "next")}
      >
        <span
          href="#0"
          className={
            pageData.next === null ? "disabled fade" : ""
          }
        >
          &gt;
        </span>
      </li>
    </ul>
  );
};

export default Pagination;
