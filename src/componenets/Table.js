import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import SkeletonLoader from "./SkeletonLoader";
import { debounce } from "../util/commonHelper";

const heading = ["Id", "Name", "Status", "Description", "Delta", "CreatedOn"];

const Table = (props) => {
  const [tableData, setData] = useState([]);
  const [sort, setSort] = useState({
    columName: "",
    sortDirection: null,
  });
  const [status, setStatus] = useState("All");
  const [searchedName, setSearchedName] = useState("");

  const [pageData, setPageData] = useState({
    next: 2,
    prev: null,
    activePage: 1,
    pages: [1, 2, 3, 4, 5],
    totalPages: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageData.activePage]);

  const getPageData = (page, direction, params, isSearchOrFilter) => {
    setIsLoading(true);
    axios
      .get(
        `https://localhost:3001/users/${page}?params=${JSON.stringify(
          params
        )}&&isSearchOrFilter=${isSearchOrFilter}`
      )
      .then((response) => {
        console.log("Response", response.data);
        setData(
          sortTableData(response.data.data, sort.columName, sort.sortDirection)
        );
        setPageData((prevPageData) => ({
          ...prevPageData,
          next: response.data.next,
          prev: response.data.prev,
          activePage: response.data.page,
          totalPages: response.data.total_pages,
          pages:
            direction === "next" && response.data.page > prevPageData.pages[4]
              ? [
                  ...new Array(
                    Math.min(
                      5,
                      response.data.total_pages - response.data.page + 1
                    )
                  ),
                ].map((_, i) => response.data.page + i)
              : direction === "prev" &&
                response.data.page < prevPageData.pages[0]
              ? [...new Array(5)].map((_, i) => response.data.page - 4 + i)
              : [
                  ...new Array(Math.min(response.data.total_pages, 5)),
                ].map((_, i) =>
                  isSearchOrFilter ? 1 + i : prevPageData.pages[0] + i
                ),
        }));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const params = {
      sort: sort,
      name: null,
      pageData: pageData,
      status: status,
    };
    getPageData(pageData.activePage, "", params);
  }, []);

  const handlePagination = (page, direction) => {
    const params = {
      sort: sort,
      name: searchedName,
      pageData: { ...pageData, activePage: page },
      status: status,
    };
    getPageData(page, direction, params);
  };

  const handleOnChange = debounce((name) => {
    setSearchedName(name);
    console.log("name", name);
    if (name === "") {
      name = null;
    }
    const params = {
      sort: sort,
      name: name,
      pageData: pageData,
      status: status,
    };
    getPageData(1, "", params, true);
  }, 800);

  const sortTableData = (data, column, sortDir) => {
    let sortedTableDta = data;
    if (column && sortDir) {
      column = column.substr(0, 1).toLowerCase() + column.substr(1);
      sortedTableDta =
        column === "name"
          ? sortedTableDta.sort((itemA, itemB) =>
              sortDir === "desc"
                ? itemB[column].localeCompare(itemA[column])
                : itemA[column].localeCompare(itemB[column])
            )
          : column === "createdOn"
          ? sortedTableDta.sort((itemA, itemB) =>
              sortDir === "desc"
                ? new Date(itemB[column]) - new Date(itemA[column])
                : new Date(itemA[column]) - new Date(itemB[column])
            )
          : sortedTableDta.sort((itemA, itemB) =>
              sortDir === "desc"
                ? itemB[column] - itemA[column]
                : itemA[column] - itemB[column]
            );
    }
    return sortedTableDta;
  };

  const handleSort = (column) => {
    if (column === "Id" || column === "Name" || column === "CreatedOn") {
      let sortDir = null;
      if (sort.columName === column) {
        sortDir = sort["sortDirection"] === "asc" ? "desc" : "asc";
      } else {
        sortDir = "asc";
      }
      setSort({ columName: column, sortDirection: sortDir });
      setData(sortTableData(tableData, column, sortDir));
    }
  };

  const handleStatusChange = (e) => {
    let statusNew = e.target.value;
    setStatus(statusNew);
    const params = {
      sort: sort,
      name: searchedName,
      pageData: pageData,
      status: statusNew,
    };
    getPageData(1, "", params, true);
  };

  return (
    <div className="main">
      <div className="filter-cont">
        <div className="filter">
          <p>Name Search</p>
          <input
            type="text"
            onChange={(e) => handleOnChange(e.target.value)}
            placeholder="Search by name..."
          ></input>
        </div>
        <div className="filter">
          <p>Filter By Status</p>
          <select
            id="status"
            className="status"
            onChange={(e) => handleStatusChange(e)}
          >
            <option value="All">ALL</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELED">CANCELED</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>
      </div>

      <table className="container">
        <thead>
          <tr>
            {heading.map((thead, index) => (
              <th onClick={() => handleSort(thead)} key={index}>
                <span
                  className={`${
                    sort.columName === thead
                      ? sort.sortDirection === "asc"
                        ? "up-arrow"
                        : "down-arrow"
                      : ""
                  }`}
                >
                  {thead}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(isLoading ? [...new Array(20)] : tableData).map((item, index) => (
            <tr key={index}>
              <td>{isLoading ? <SkeletonLoader /> : item.id}</td>
              <td>{isLoading ? <SkeletonLoader /> : item.name}</td>
              <td>{isLoading ? <SkeletonLoader /> : item.status}</td>
              <td>{isLoading ? <SkeletonLoader /> : item.description}</td>
              <td>{isLoading ? <SkeletonLoader /> : item.delta}</td>
              <td>
                {isLoading ? (
                  <SkeletonLoader />
                ) : (
                  new Date(item.createdOn).toDateString()
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tableData.length > 0 && !isLoading && (
        <Pagination handlePagination={handlePagination} pageData={pageData} />
      )}
    </div>
  );
};

export default Table;
