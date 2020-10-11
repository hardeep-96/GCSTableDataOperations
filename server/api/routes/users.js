const express = require("express");
const router = express.Router();
const path = require("path");
const { Storage } = require("@google-cloud/storage");

const gc = new Storage({
  keyFilename: path.join(__dirname, "../../key/demotable-7457736c691f.json"),
  projectId: "demotable",
});
// gc.getBuckets().then((x) => console.log("bucketList", x));

const getBucket = () => {
  const dataBucket = gc.bucket("tablegcs");
  const archivo = dataBucket.file("users.json").createReadStream();
  return archivo;
};


const search = (data, name) => {
  let result = data;
  if (name !== null) {
    result = data.filter((item) => item.name.includes(name));
  } else {
    result = data;
  }
  return result;
};

const sort = (data, column, sortDir) => {
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

const filter = (data, status) => {
  let jsonArray = data;
  if (status !== "All") {
    jsonArray = data.filter((item) => item.status === status);
  }
  return jsonArray;
};

router.get("/:page", (req, res, next) => {
  let users = "";
  let resultRows = [];
  const params = JSON.parse(req.query.params);
  const curr_page = req.params.page;
  const isSearchOrFilter = req.query.isSearchOrFilter;

  const searchedname = params.name;
  const sortingColumn = params.sort.columName;
  const sortingDirection = params.sort.sortDirection;
  const status = params.status;

  const data = getBucket();
  data
    .on("data", function (d) {
      users += d;
    })
    .on("end", function () {
      const parsedData = users ? JSON.parse(users).output : [];
      if (parsedData.length) {
        resultRows = search(parsedData, searchedname);
        resultRows = filter(resultRows, status);
        resultRows = sort(resultRows, sortingColumn, sortingDirection);

        function Paginator(items, page = 1, per_page = 20) {
          var offset = isSearchOrFilter === "true" ? 0 : (page - 1) * per_page,
            paginatedItems = items.slice(offset, +offset + 20);
          total_pages = Math.ceil(items.length / per_page);
          return {
            page: Number(page),
            prev: page - 1 ? page - 1 : null,
            next: Number(page) + 1 <= total_pages ? Number(page) + 1 : null,
            total_pages: total_pages,
            data: paginatedItems,
          };
        }
      }

      const response = Paginator(resultRows, curr_page, 20);

      res.status(200).json(response);
    })
    .on("error", function (err) {
      console.error(err);
    });
});

module.exports = router;
