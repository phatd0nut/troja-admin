import React, { useState } from "react";
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

const CustomerTable = ({ searchQuery, searchCriteria }) => {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const rowsPerPage = 15; // Visa alltid 15 rader per sida

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

  const rows = [
    { name: "John Doe", address: "Testvägen 1", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "Jane Doe", address: "Testvägen 2", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "John Smith", address: "Testvägen 3", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "Jane Smith", address: "Testvägen 4", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "John Johnson", address: "Testvägen 5", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "Jane Johnson", address: "Testvägen 6", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "John Jackson", address: "Testvägen 7", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "Jane Jackson", address: "Testvägen 8", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "John Doe", address: "Testvägen 1", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "Jane Doe", address: "Testvägen 2", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "John Smith", address: "Testvägen 3", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "Jane Smith", address: "Testvägen 4", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "John Johnson", address: "Testvägen 5", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "Jane Johnson", address: "Testvägen 6", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "John Jackson", address: "Testvägen 7", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "Jane Jackson", address: "Testvägen 8", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "John Doe", address: "Testvägen 1", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "Jane Doe", address: "Testvägen 2", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "John Smith", address: "Testvägen 3", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    { name: "Jane Smith", address: "Testvägen 4", postcode: "12345", city: "Teststad", phone: "070-123 45 67", email: "" },
    // Lägg till fler rader här
  ];

  const criteriaMapping = {
    Namn: "name",
    Adress: "address",
    Postnummer: "postcode",
    Stad: "city",
    Telefon: "phone",
    Email: "email",
  };

  const filteredRows = searchCriteria.length > 0
    ? rows.filter((row) =>
        searchCriteria.some((criteria) =>
          row[criteriaMapping[criteria]]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : rows;

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
    <TableCell sx={{
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
    }}>
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

  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#dc2e34" }}>
            <TableRow>
              {renderTableSortLabel("name", "Namn")}
              {renderTableSortLabel("address", "Adress")}
              {renderTableSortLabel("postcode", "Postnummer")}
              {renderTableSortLabel("city", "Stad")}
              {renderTableSortLabel("phone", "Telefon")}
              {renderTableSortLabel("email", "Email")}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => (
              <TableRow key={index} sx={{
                "&:hover": {
                  backgroundColor: "rgba(220, 46, 52, 0.1)",
                  cursor: "pointer",
                },
              }}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.postcode}</TableCell>
                <TableCell>{row.city}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="body2">
          Sida {page} av {totalPages}
        </Typography>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
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
    </Paper>
  );
};

export default CustomerTable;