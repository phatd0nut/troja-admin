import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Pagination,
  TableSortLabel,
} from "../utils/MaterialUI";
import { fetchAllCustomers } from "../services/customerService";

const CustomerTable = ({ searchQuery }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  useEffect(() => {
    const handleResize = () => {
      const availableHeight = window.innerHeight;
      if (availableHeight < 960) {
        setRowsPerPage(5);
      } else if (availableHeight < 1200) {
        setRowsPerPage(10);
      } else {
        setRowsPerPage(15);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Kör funktionen en gång vid montering

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const data = await fetchAllCustomers();
        setCustomers(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getCustomers();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getSortProps = (property) => ({
    active: orderBy === property,
    direction: orderBy === property ? order : "asc",
    onClick: () => handleRequestSort(property),
  });

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const columns = [
    { id: "name", label: "Namn" },
    { id: "email", label: "Email" },
    { id: "phoneNumber", label: "Telefon" },
    { id: "postalAddress", label: "Adress" },
    { id: "zipcode", label: "Postnummer" },
    { id: "city", label: "Stad" },
    { id: "points", label: "Poäng" },
    { id: "acceptInfo", label: "Nyhetsbrev" },
  ];

  const filteredRows = searchQuery
    ? customers.filter((row) =>
        columns.some((column) =>
          row[column.id]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      )
    : customers;

  const sortedRows = filteredRows.sort((a, b) => {
    if (orderBy) {
      if (order === "asc") {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      } else {
        return a[orderBy] > b[orderBy] ? -1 : 1;
      }
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

  const renderTableSortLabel = (columnId, label) => (
    <TableCell
      key={columnId}
      sx={{
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "1.1rem",
        "&:hover": {
          color: "white",
        },
        "&.Mui-active": {
          color: "white",
        },
        "& .MuiTableSortLabel-icon": {
          color: "white !important",
        },
      }}
    >
      <TableSortLabel
        {...getSortProps(columnId)}
        focusRipple={true}
        disableRipple={false}
        disableTouchRipple={false}
        sx={{
          "&:hover": {
            color: "white !important",
          },
          "&.Mui-active": {
            color: "white !important",
          },
          "& .MuiTableSortLabel-icon": {
            color: "white !important",
          },
        }}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Paper id="tablePaper" elevation={3}>
      <TableContainer className="tableContainer">
        <Table>
          <TableHead
            sx={{ backgroundColor: "#dc2e34", position: "sticky", top: 0 }}
          >
            <TableRow>
              {columns.map((column) =>
                renderTableSortLabel(column.id, column.label)
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(220, 46, 52, 0.1)",
                      cursor: "pointer",
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.id === "name"
                        ? `${row.firstName} ${row.lastName}`
                        : column.id === "acceptInfo"
                        ? row[column.id] === 1
                          ? "Ja"
                          : "Nej"
                        : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
            >
              <Typography variant="body2">
                Sida {page} av {totalPages}
              </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChangePage}
                color="primary"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&:hover": {
                      backgroundColor: "black",
                      color: "white",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "black",
                      color: "white",
                    },
                    fontWeight: "bold",
                  },
                }}
              />
            </Box>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CustomerTable;
