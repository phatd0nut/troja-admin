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
  PersonAdd,
  PersonRemove,
  ArrowBackIcon,
  VisibilityIcon,
  DeleteIcon,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
} from "../utils/MaterialUI";
import Button from "./Button";
import InputField from "./InputField";
import LoadingCircle from "./LoadingCircle";

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
      customerGroups = {
        allCustomers: [],
      },
      onClose,
      selectedGroups,
      setSelectedGroups,
    },
    ref
  ) => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const rowsPerPage = 6;
    const [tabValue, setTabValue] = useState(0);
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
    const [searchedCustomers, setSearchedCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [customGroupName, setCustomGroupName] = useState(
      "Personligt utskick/Grupp"
    );
    const [debouncedSearchTerm, setDebouncedSearchTerm] =
      useState(customerSearchTerm);
    const [inspectingGroup, setInspectingGroup] = useState(null);
    const [currentGroupName, setCurrentGroupName] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [inspectionPage, setInspectionPage] = useState(1);
    const inspectionRowsPerPage = 6;

    const handleInspectGroup = (goodsName, event) => {
      event.stopPropagation();
      setCurrentGroupName(goodsName);
    
      // Helper function to remove duplicates
      const getUniqueCustomers = (customers) => {
        const uniqueCustomersMap = new Map();
        customers.forEach(customer => {
          const email = customer.email?.toLowerCase();
          if (email && !uniqueCustomersMap.has(email)) {
            uniqueCustomersMap.set(email, customer);
          }
        });
        return Array.from(uniqueCustomersMap.values());
      };
      
    
      let customersToInspect;
      if (goodsName === "Alla kunder") {
        customersToInspect = getUniqueCustomers(customerGroups.allCustomers);
      } else if (customerGroups.customGroups && customerGroups.customGroups[goodsName]) {
        customersToInspect = getUniqueCustomers(customerGroups.customGroups[goodsName].customers);
      } else {
        customersToInspect = getUniqueCustomers(
          customerGroups.allCustomers.filter(customer => customer.goodsName === goodsName)
        );
      }
    
      setInspectingGroup(customersToInspect);
      setInspectionPage(1); // Reset pagination when changing groups
    };
    const handleInspectionPageChange = (event, newPage) => {
      setInspectionPage(newPage);
    };

    const handleClearCustomGroups = async () => {
      setIsDeleting(true);

      if (localStorage.getItem("customGroups")) {
        try {
          localStorage.removeItem("customGroups");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          window.location.reload();
        } catch (error) {
          console.error("Error clearing custom groups:", error);
        } finally {
          setIsDeleting(false);
        }
      } else {
        setIsDeleting(false);
        setOpenSnackbar(true);
      }
    };

    const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
    };

    // Add this useEffect to create the debounce effect
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(customerSearchTerm);
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
    }, [customerSearchTerm]);

    // Add this useEffect to perform search when debounced term changes
    useEffect(() => {
      if (debouncedSearchTerm) {
        handleCustomerSearch();
      }
    }, [debouncedSearchTerm]);

    // Hämta sparade kundgrupper från localStorage
    useEffect(() => {
      const savedSelectedGroups =
        JSON.parse(localStorage.getItem("selectedGroups")) || [];
      const savedGroupCounts =
        JSON.parse(localStorage.getItem("groupCounts")) || {};
      const savedSelectedCustomers =
        JSON.parse(localStorage.getItem("selectedCustomers")) || [];

      setSelectedGroups(savedSelectedGroups);
      setGroupCounts(savedGroupCounts);
      setSelectedCustomers(savedSelectedCustomers);
    }, [setSelectedGroups]);

    const saveSelectedGroupsToLocalStorage = (groups) => {
      localStorage.setItem("selectedGroups", JSON.stringify(groups));
    };

    const saveGroupCountsToLocalStorage = (counts) => {
      localStorage.setItem("groupCounts", JSON.stringify(counts));
    };

    const saveSelectedCustomersToLocalStorage = (customers) => {
      localStorage.setItem("selectedCustomers", JSON.stringify(customers));
    };

    const uniqueGroups = Array.from(
      new Set([
        "Alla kunder",
        ...customerGroups.allCustomers
          .filter((group) => group.goodsName !== "Alla kunder")
          .map((group) => group.goodsName),
        ...(customerGroups.customGroups
          ? Object.keys(customerGroups.customGroups)
          : []), // Add custom groups if available
      ])
    );
    const [groupCounts, setGroupCounts] = useState({});

    // Function to handle customer search
    const handleCustomerSearch = () => {
      if (!customerSearchTerm.trim()) {
        setSearchedCustomers([]);
        return;
      }

      // First find all matching customers
      const matchingCustomers = customerGroups.allCustomers.filter(
        (customer) => {
          const fullName = `${customer.firstName || ""} ${
            customer.lastName || ""
          }`.toLowerCase();
          const email = (customer.email || "").toLowerCase();
          const searchLower = customerSearchTerm.toLowerCase();

          return fullName.includes(searchLower) || email.includes(searchLower);
        }
      );

      // Remove duplicates by creating a Map with email as key
      const uniqueCustomersMap = new Map();

      matchingCustomers.forEach((customer) => {
        // Use email as the unique identifier - you could also use ID if that's reliable
        const key = customer.email || customer.id;

        // Only add the customer if they don't already exist in the map
        if (!uniqueCustomersMap.has(key)) {
          uniqueCustomersMap.set(key, customer);
        }
      });

      // Convert the Map back to an array
      const uniqueResults = Array.from(uniqueCustomersMap.values());

      setSearchedCustomers(uniqueResults);
    };

    // Function to add/remove customer from selection
    const toggleCustomerSelection = (customer) => {
      setSelectedCustomers((prev) => {
        // Check if the customer is already selected by ID
        const isAlreadySelected = prev.some((c) => c.id === customer.id);

        let newSelection;
        if (isAlreadySelected) {
          // Remove the customer if already selected
          newSelection = prev.filter((c) => c.id !== customer.id);
        } else {
          // Add the customer only if not already in the list
          newSelection = [...prev, customer];
        }

        saveSelectedCustomersToLocalStorage(newSelection);
        return newSelection;
      });
    };

    // Function to save the custom group
    const saveCustomGroup = () => {
      if (selectedCustomers.length === 0) return;

      // Create a group name that includes the count
      const groupNameWithCount = `${customGroupName} (${selectedCustomers.length} kunder)`;

      const customGroup = {
        name: groupNameWithCount,
        originalName: customGroupName,
        customers: selectedCustomers,
        timestamp: new Date().toISOString(),
      };

      // Save to localStorage
      const savedCustomGroups = JSON.parse(
        localStorage.getItem("customGroups") || "{}"
      );
      savedCustomGroups[groupNameWithCount] = customGroup;
      localStorage.setItem("customGroups", JSON.stringify(savedCustomGroups));

      // Add to selected groups if not already present
      // Remove any previous version of this custom group first
      const updatedGroups = selectedGroups.filter(
        (group) => !group.startsWith(customGroupName + " (")
      );

      // Add the new group with count
      updatedGroups.push(groupNameWithCount);
      setSelectedGroups(updatedGroups);
      saveSelectedGroupsToLocalStorage(updatedGroups);

      // Clear selected customers since they're now in a group
      setSelectedCustomers([]);
      saveSelectedCustomersToLocalStorage([]);
    };

    // Function to handle tab change
    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };

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

    const handleClearCustomers = () => {
      setSelectedCustomers([]);
      saveSelectedCustomersToLocalStorage([]);
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
            marginBottom: 3,
          }}
        >
          <Typography variant="h4" color="primary">
            Välj mottagare
          </Typography>
          <Button
            onClick={() => onClose(selectedGroups, selectedCustomers)}
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

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Kundgrupper" />
          <Tab label="Enskilda kunder" />
        </Tabs>

        {tabValue === 0 && (
          <>
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
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  height: 56,
                }}
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
                <Button
                  onClick={handleClearCustomGroups}
                  variant="outlined"
                  color="secondary"
                  endIcon={
                    isDeleting ? <LoadingCircle size={20} /> : <DeleteIcon />
                  }
                  disabled={isDeleting}
                  sx={{ height: "100%" }}
                >
                  {isDeleting ? "Tömmer grupper..." : "Töm skapade grupper"}
                </Button>
              </Box>
            </Box>

            {inspectingGroup ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    Kunder i gruppen: {inspectingGroup ? currentGroupName : ""}
                  </Typography>
                </Box>
                <TableContainer
                  component={Paper}
                  sx={{
                    mt: 2,
                    minHeight: 400,
                    maxHeight: 400,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <CustomTableCell>Namn</CustomTableCell>
                        <CustomTableCell>E-post</CustomTableCell>
                        <CustomTableCell>Telefon</CustomTableCell>
                        <CustomTableCell>
                          {" "}
                                                   <Button
                            onClick={() => setInspectingGroup(null)}
                            variant="outlined"
                            color="secondary"
                            endIcon={<ArrowBackIcon />}
                            sx={{
                              color: '#ffffff',
                              borderColor: '#ffffff',
                              '&:hover': {
                                borderColor: '#ffffff',
                                color: '#ffffff',
                                backgroundColor: '#000000'
                              }
                            }}
                          >
                            Tillbaka
                          </Button>
                        </CustomTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inspectingGroup
                        .slice(
                          (inspectionPage - 1) * inspectionRowsPerPage,
                          inspectionPage * inspectionRowsPerPage
                        )
                        .map((customer, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {customer.firstName} {customer.lastName}
                            </TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phoneNumber}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box display="flex" justifyContent="end" sx={{ mt: 2 }}>
                  <Pagination
                    count={Math.ceil(
                      inspectingGroup.length / inspectionRowsPerPage
                    )}
                    page={inspectionPage}
                    onChange={handleInspectionPageChange}
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
              </>
            ) : (
              <>
                <TableContainer
                  component={Paper}
                  sx={{ mt: 2, minHeight: 400, maxHeight: 400 }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <Alert
                          onClose={handleCloseSnackbar}
                          severity="error"
                          size="large"
                          sx={{ width: "100%" }}
                        >
                          Det finns inga sparade grupper att ta bort
                        </Alert>
                      </Snackbar>
                      <TableRow>
                        <CustomTableCell>Grupp</CustomTableCell>
                        <CustomTableCell>Kunder</CustomTableCell>
                        <CustomTableCell>Välj för utskick</CustomTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedGroups.length > 0 ? (
                        paginatedGroups.map((goodsName, index) => {
                          let acceptCount;
                          if (goodsName === "Alla kunder") {
                            const uniqueCustomers = new Map();
                            customerGroups.allCustomers.forEach(customer => {
                              const email = customer.email?.toLowerCase();
                              if (email) uniqueCustomers.set(email, customer);
                            });
                            acceptCount = uniqueCustomers.size;
                          } else if (customerGroups.customGroups && customerGroups.customGroups[goodsName]) {
                            const uniqueCustomers = new Map();
                            customerGroups.customGroups[goodsName].customers.forEach(customer => {
                              const email = customer.email?.toLowerCase();
                              if (email) uniqueCustomers.set(email, customer);
                            });
                            acceptCount = uniqueCustomers.size;
                          } else {
                            const filteredCustomers = customerGroups.allCustomers.filter(
                              group => group.goodsName === goodsName
                            );
                            const uniqueCustomers = new Map();
                            filteredCustomers.forEach(customer => {
                              const email = customer.email?.toLowerCase();
                              if (email) uniqueCustomers.set(email, customer);
                            });
                            acceptCount = uniqueCustomers.size;
                          }
                          
                          return (
                            <TableRow
                              key={index}
                              onClick={() => handleRowClick(goodsName)}
                              sx={{
                                cursor: "pointer",
                                backgroundColor: selectedGroups.includes(
                                  goodsName
                                )
                                  ? ""
                                  : "inherit",
                                "&:hover": {
                                  backgroundColor: "rgba(220, 46, 52, 0.2)",
                                },
                              }}
                            >
                              <TableCell>{goodsName}</TableCell>
                              <TableCell>
                                {acceptCount}
                                <Button
                                  size="medium"
                                  onClick={(e) =>
                                    handleInspectGroup(goodsName, e)
                                  }
                                  sx={{
                                    color: "#666666",
                                    padding: 0,
                                    margin: 0,
                                    minWidth: 0,
                                    "&:hover": {
                                      color: "#dc2e34",
                                      backgroundColor: "transparent",
                                    },
                                  }}
                                  endIcon={<VisibilityIcon />}
                                />
                              </TableCell>
                              <TableCell>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Checkbox
                                    disableRipple={true}
                                    checked={selectedGroups.includes(goodsName)}
                                    onChange={handleCheckboxChange}
                                    name={goodsName}
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{ padding: 0 }}
                                  />
                                </Box>
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
              </>
            )}
          </>
        )}

        {tabValue === 1 && (
          <Box sx={{ mb: 3 }}>
            <InputField
              label="Namn på ny kundgrupp"
              value={customGroupName}
              onChange={(e) => setCustomGroupName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 2 }}>
              <InputField
                label="Sök kund (namn eller e-post)"
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
            </Box>

            <Paper sx={{ maxHeight: 200, overflow: "auto", mb: 2 }}>
              <List dense>
                {searchedCustomers.map((customer, index) => (
                  <ListItem
                    key={`searched-${customer.id}-${index}`}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        checked={selectedCustomers.some(
                          (c) => c.id === customer.id
                        )}
                        onChange={() => toggleCustomerSelection(customer)}
                      />
                    }
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(220, 46, 52, 0.2)",
                      },
                    }}
                    onClick={() => toggleCustomerSelection(customer)}
                  >
                    <ListItemText
                      primary={`${customer.firstName} ${customer.lastName}`}
                      secondary={customer.email}
                    />
                  </ListItem>
                ))}
                {customerSearchTerm && searchedCustomers.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Inga kunder hittades" />
                  </ListItem>
                )}
              </List>
            </Paper>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                mt: 4,
              }}
            >
              <Typography variant="h6">
                Valda kunder: {selectedCustomers.length}
              </Typography>
            </Box>

            <Paper sx={{ maxHeight: 200, overflow: "auto", mb: 2 }}>
              <List dense>
                {selectedCustomers.map((customer) => (
                  <ListItem
                    key={customer.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => toggleCustomerSelection(customer)}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`${customer.firstName} ${customer.lastName}`}
                      secondary={customer.email}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Button
              onClick={saveCustomGroup}
              variant="contained"
              color="primary"
              disabled={selectedCustomers.length === 0}
              endIcon={<PersonAdd />}
            >
              Lägg till i grupp
            </Button>
            <Button
              onClick={handleClearCustomers}
              variant="outlined"
              color="secondary"
              sx={{ ml: 2 }}
              endIcon={<PersonRemove />}
            >
              Rensa val
            </Button>
          </Box>
        )}

        <Divider sx={{ mt: 4 }} />
        <Box sx={{ mt: 2, height: 240, overflowY: "auto" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Valda Kundgrupper: {selectedGroups.length}
            {selectedCustomers.length > 0 &&
              ` + ${selectedCustomers.length} enskilda kunder`}
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

              {selectedCustomers.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    padding: "4px 8px",
                  }}
                >
                  <Typography>
                    {customGroupName} ({selectedCustomers.length} kunder)
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleClearCustomers}
                    sx={{ marginLeft: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          ) : (
            <Typography sx={{ mt: 1 }}>
              {selectedCustomers.length === 0
                ? "Inga mottagare valda."
                : `${selectedCustomers.length} enskilda kunder valda.`}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => onClose(selectedGroups, selectedCustomers)}
          endIcon={<Check />}
          disabled={
            selectedGroups.length === 0 && selectedCustomers.length === 0
          }
        >
          Bekräfta val
        </Button>
      </Box>
    );
  }
);

export default SelectCustomerGroupModal;
