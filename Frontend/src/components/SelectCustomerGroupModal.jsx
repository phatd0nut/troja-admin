import React, { useState, useEffect, forwardRef } from "react";
import {
  Box,
  Typography,
  Divider,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
  CloseIcon,
  GroupAdd,
  GroupRemove,
  Check,
  styled,
} from "../utils/MaterialUI";
import Button from "./Button";
import InputField from "./InputField";

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#dc2e34",
  color: "#ffffff",
  fontWeight: "bold",
  fontSize: "1.1rem",
  width: "33.33%",
}));

const SelectCustomerGroupModal = forwardRef(
  (
    {
      customerGroups = { allCustomers: [], customersWithAcceptInfo: [] },
      onClose,
      selectedGroups,
      setSelectedGroups,
    },
    ref
  ) => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const rowsPerPage = 6;

    // Hämta sparade kundgrupper från localStorage
    useEffect(() => {
      const savedSelectedGroups =
        JSON.parse(localStorage.getItem("selectedGroups")) || [];
      const savedGroupCounts =
        JSON.parse(localStorage.getItem("groupCounts")) || {};
      setSelectedGroups(savedSelectedGroups);
      setGroupCounts(savedGroupCounts);
    }, [setSelectedGroups]);

    const saveSelectedGroupsToLocalStorage = (groups) => {
      localStorage.setItem("selectedGroups", JSON.stringify(groups));
    };

    const saveGroupCountsToLocalStorage = (counts) => {
      localStorage.setItem("groupCounts", JSON.stringify(counts));
    };

    const uniqueGroups = Array.from(
      new Set(customerGroups.allCustomers.map((group) => group.goodsName))
    );

    const [groupCounts, setGroupCounts] = useState({});

    const handleCheckboxChange = (event) => {
      const { name, checked } = event.target;
      let updatedGroups;
      if (checked) {
        updatedGroups = [...selectedGroups, name];
        setGroupCounts((prevCounts) => {
          const newCounts = {
            ...prevCounts,
            [name]: (prevCounts[name] || 0) + 1,
          };
          saveGroupCountsToLocalStorage(newCounts);
          return newCounts;
        });
      } else {
        updatedGroups = selectedGroups.filter((group) => group !== name);
      }
      setSelectedGroups(updatedGroups);
      saveSelectedGroupsToLocalStorage(updatedGroups);
    };

    const handleRowClick = (goodsName) => {
      let updatedGroups;
      if (selectedGroups.includes(goodsName)) {
        updatedGroups = selectedGroups.filter((group) => group !== goodsName);
      } else {
        updatedGroups = [...selectedGroups, goodsName];
        setGroupCounts((prevCounts) => {
          const newCounts = {
            ...prevCounts,
            [goodsName]: (prevCounts[goodsName] || 0) + 1,
          };
          saveGroupCountsToLocalStorage(newCounts);
          return newCounts;
        });
      }
      setSelectedGroups(updatedGroups);
      saveSelectedGroupsToLocalStorage(updatedGroups);
    };

    const handleRemoveGroup = (group) => {
      const updatedGroups = selectedGroups.filter(
        (selectedGroup) => selectedGroup !== group
      );
      setSelectedGroups(updatedGroups);
      saveSelectedGroupsToLocalStorage(updatedGroups);
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };

    const handleSelectAll = () => {
      setSelectedGroups(filteredGroups);
      saveSelectedGroupsToLocalStorage(filteredGroups);
    };

    const handleClearAll = () => {
      setSelectedGroups([]);
      saveSelectedGroupsToLocalStorage([]);
    };

    const filteredGroups = uniqueGroups.filter((group) =>
      group.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Visa valda och regelbundet använda grupper först
    const sortedGroups = [...filteredGroups].sort((a, b) => {
      const countA = groupCounts[a] || 0;
      const countB = groupCounts[b] || 0;
      if (selectedGroups.includes(a) && !selectedGroups.includes(b)) {
        return -1;
      }
      if (!selectedGroups.includes(a) && selectedGroups.includes(b)) {
        return 1;
      }
      return countB - countA;
    });

    const paginatedGroups = sortedGroups.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );

    return (
      <Box
        ref={ref}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          minWidth: 800,
          minHeight: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          outline: "none",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <Typography variant="h4" color="primary">
            Välj Kundgrupper
          </Typography>
          <Button
            onClick={() => onClose(selectedGroups)}
            variant="text"
            color="secondary"
            endIcon={<CloseIcon />}
            sx={{
              "& .MuiButton-endIcon": {
                margin: 0,
                padding: 0,

              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <InputField
            label="Sök kundgrupp"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 2 }}
          />
          <Box
            sx={{ display: "flex", gap: 2, alignItems: "center", height: 56 }}
          >
            <Button
              onClick={handleSelectAll}
              variant="contained"
              color="primary"
              endIcon={<GroupAdd />}
              sx={{ height: "100%" }}
            >
              Välj alla
            </Button>
            <Button
              onClick={handleClearAll}
              variant="contained"
              color="primary"
              endIcon={<GroupRemove />}
              sx={{ height: "100%" }}
            >
              Rensa alla
            </Button>
          </Box>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ mt: 2, minHeight: 400, maxHeight: 400 }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <CustomTableCell>Grupp</CustomTableCell>
                <CustomTableCell>
                  Antal kunder som accepterar utskick
                </CustomTableCell>
                <CustomTableCell>Välj för utskick</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedGroups.length > 0 ? (
                paginatedGroups.map((goodsName, index) => {
                  const acceptCount =
                    customerGroups.customersWithAcceptInfo.filter(
                      (group) => group.goodsName === goodsName
                    ).length;
                  const totalCount = customerGroups.allCustomers.filter(
                    (group) => group.goodsName === goodsName
                  ).length;
                  return (
                    <TableRow
                      key={index}
                      onClick={() => handleRowClick(goodsName)}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: selectedGroups.includes(goodsName)
                          ? ""
                          : "inherit",
                        "&:hover": {
                          backgroundColor: "rgba(220, 46, 52, 0.2)",
                        },
                      }}
                    >
                      <TableCell>{goodsName}</TableCell>
                      <TableCell>
                        {acceptCount} ({totalCount})
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          disableRipple={true}
                          checked={selectedGroups.includes(goodsName)}
                          onChange={handleCheckboxChange}
                          name={goodsName}
                          sx={{ padding: 0 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography sx={{ mt: 2 }}>
                      Inga kundgrupper tillgängliga.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="end" sx={{ mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredGroups.length / rowsPerPage)}
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
        <Divider sx={{ mt: 4 }} />
        <Box
          sx={{
            mt: 2,
            height: 240,
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Valda Kundgrupper: {selectedGroups.length}
          </Typography>
          {selectedGroups.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedGroups.map((group, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    padding: "4px 8px",
                  }}
                >
                  <Typography>{group}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveGroup(group)}
                    sx={{ marginLeft: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography sx={{ mt: 1 }}>Inga kundgrupper valda.</Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => onClose(selectedGroups)}
          endIcon={<Check />}
        >
          Bekräfta val
        </Button>
      </Box>
    );
  }
);

export default SelectCustomerGroupModal;
