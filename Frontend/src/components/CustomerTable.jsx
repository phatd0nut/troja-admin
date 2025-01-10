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
  Modal,
} from "../utils/MaterialUI";
import { fetchAllCustomers } from "../services/customerService";
import CustomerModal from "./CustomerModal";

const CustomerTable = ({ searchQuery, searchCriteria }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const columns = [
    { id: "name", label: "Namn", mapping: "namn", colSpan: 2 },
    { id: "email", label: "Email", mapping: "email", colSpan: 2 },
    { id: "phoneNumber", label: "Telefon", mapping: "telefon", colSpan: 1 },
    { id: "postalAddress", label: "Adress", mapping: "adress", colSpan: 2 },
    { id: "zipcode", label: "Postnummer", mapping: "postnummer", colSpan: 1 },
    { id: "city", label: "Stad", mapping: "stad", colSpan: 1 },
    { id: "points", label: "Poäng", mapping: "poäng", colSpan: 1 },
    { id: "acceptInfo", label: "Nyhetsbrev", mapping: "nyhetsbrev", colSpan: 1 }
  ];

  const filteredRows = searchQuery && searchCriteria.length > 0
    ? customers.filter((row) => {
        const column = columns.find(col => col.mapping === searchCriteria[0].toLowerCase());
        let value;
        if (column.id === "name") {
          value = `${row.firstName} ${row.lastName}`.toLowerCase();
        } else if (column.id === "acceptInfo") {
          value = row[column.id] === 1 ? "ja" : "nej";
        } else {
          value = row[column.id]?.toString().toLowerCase();
        }
        const query = searchQuery.toLowerCase();
        return value && value.includes(query);
      })
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
      colSpan={columns.find(col => col.id === columnId).colSpan}
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
    <>
      <Paper id="tablePaper" elevation={3}>
        <TableContainer className="tableContainer">
          <Table>
            <TableHead
              sx={{ backgroundColor: "#dc2e34", position: "sticky" }}
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
          backgroundColor: "rgba(220, 46, 52, 0.2)",
          cursor: "pointer",
        },
      }}
      onClick={() => handleRowClick(row)}
    >
      {columns.map((column) => (
        <TableCell 
          key={column.id}
          colSpan={column.colSpan}
        >
          {column.id === "name"
            ? `${row.firstName} ${row.lastName}`
            : column.id === "acceptInfo"
            ? row[column.id] === 1
              ? "Ja"
              : "Nej"
            : column.id === "city"
            ? row[column.id].charAt(0).toUpperCase() +
              row[column.id].slice(1).toLowerCase()
            : column.id === "postalAddress" &&
              /^\d+$/.test(row[column.id])
            ? ""
            : row[column.id]}
        </TableCell>
      ))}
    </TableRow>
  ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      </Paper>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        // disableEnforceFocus
        // disableAutoFocus
      >
        <CustomerModal customer={selectedCustomer} onClose={handleCloseModal} />
      </Modal>
    </>
  );
};

export default CustomerTable;