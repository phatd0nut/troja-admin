import React, { useRef, useState, useEffect } from "react";
import {
  Paper,
  Typography,
  SendIcon,
  DownloadIcon,
  GroupIcon,
  GroupAddIcon,
  SubjectIcon,
  Modal,
  Box,
  Dialog,
  DialogContent,
} from "../utils/MaterialUI";
import Toolbar from "../components/Toolbar";
import EmailBuilder from "../components/Emailbuilder";
import Button from "../components/Button";
import axios from "axios";
import { fetchCustomersGroupedByGoods } from "../services/customerService";
import SelectCustomerGroupModal from "../components/SelectCustomerGroupModal";
import LoadingCircle from "../components/LoadingCircle";
import SubjectModal from "../components/SubjectModal";

/**
 * Mailing-komponenten hanterar e-postutskick till kundgrupper.
 * Den tillåter användaren att importera e-postmallar, välja kundgrupper,
 * ange en rubrik och skicka e-postmeddelanden till valda kundgrupper.
 *
 * @component Mailing
 * @returns {JSX.Element} JSX-element som representerar Mailing-komponenten.
 *
 * @example
 * <Mailing />
 *
 * @description
 * Mailing-komponenten använder flera hooks och funktioner för att hantera e-postutskick:
 * - `useRef`: För att referera till e-postbyggaren och rubriken.
 * - `useState`: För att hantera tillstånd för kundgrupper, modaler, valda grupper, laddning, meddelanden och mottagare.
 * - `useEffect`: För att hämta sparade grupper från localStorage när komponenten laddas.
 *
 * @function
 * @name Mailing
 *
 * @function handleFileChange
 * Hanterar filändringar och laddar en e-postmall från en JSON-fil.
 * @param {Event} event - Filändringshändelsen.
 *
 * @function handleSendEmail
 * Skickar e-postmeddelanden till valda kundgrupper.
 * @param {string} htmlContent - HTML-innehållet i e-postmeddelandet.
 *
 * @function handleSelectCustomerGroups
 * Hämtar kundgrupper och öppnar modalen för att välja kundgrupper.
 *
 * @function handleCloseModal
 * Stänger modalen och sparar valda kundgrupper i localStorage.
 * @param {Array} selectedGroups - De valda kundgrupperna.
 *
 * @function handleCloseDialog
 * Stänger dialogen som visar laddningsstatus eller meddelanden.
 *
 * @function handleSaveSubject
 * Sparar den angivna rubriken och stänger rubrikmodalen.
 * @param {string} newSubject - Den nya rubriken.
 */
const Mailing = () => {
  const emailBuilderRef = useRef(null);
  const subjectRef = useRef("");
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const MAIL_URL = import.meta.env.VITE_SEND_MAIL_ENDPOINT;
  const [customerGroups, setCustomerGroups] = useState({
    allCustomers: [],
    // customersWithAcceptInfo: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [recipientsCount, setRecipientsCount] = useState(0);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customGroups, setCustomGroups] = useState({});

  // Hämta sparade grupper från localStorage när komponenten laddas
  useEffect(() => {
    const savedGroups =
      JSON.parse(localStorage.getItem("selectedGroups")) || [];
    const savedCustomers =
      JSON.parse(localStorage.getItem("selectedCustomers")) || [];
    const savedCustomGroups =
      JSON.parse(localStorage.getItem("customGroups")) || {};
    const savedCustomerGroups = JSON.parse(
      localStorage.getItem("customerGroups")
    ) || { allCustomers: [] };

    setSelectedGroups(savedGroups);
    setSelectedCustomers(savedCustomers);
    setCustomGroups(savedCustomGroups);
    setCustomerGroups(savedCustomerGroups); // Changed from setCustomGroups to setCustomerGroups
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const template = JSON.parse(e.target.result);
        emailBuilderRef.current.loadTemplate(template);
      };
      reader.readAsText(file);
    }
  };

  // // Använd testadresser för att skicka e-post
  // const testEmailAddresses = ["ez222dc@student.lnu.se"];

  // // Testfunktion för att logga e-postadresser
  // const logEmailAddresses = () => {
  //   // Samla in e-postadresser från valda kundgrupper inom customersWithAcceptInfo
  //   const emailAddresses = customerGroups.customersWithAcceptInfo
  //     .filter((customer) => selectedGroups.includes(customer.goodsName))
  //     .map((customer) => customer.email);

  //   console.log("Selected email addresses:", emailAddresses);
  //   console.log("With subject:", subject);
  // };

  const handleSendEmail = async (htmlContent) => {
    if (!htmlContent || !subjectRef.current) {
      console.log("Missing content or subject");
      return;
    }
    
    setLoading(true);
    setMessage("Skickar e-postmeddelanden...");

    try {
      const token = localStorage.getItem("token");

      // Get data from state and localStorage
      const storedCustomerData = JSON.parse(
        localStorage.getItem("customerGroups")
      );
      const currentCustomerGroups = storedCustomerData || customerGroups;

      const currentSelectedGroups = JSON.parse(
        localStorage.getItem("selectedGroups") || "[]"
      );
      const currentCustomGroups = JSON.parse(
        localStorage.getItem("customGroups") || "{}"
      );
      const currentSelectedCustomers = JSON.parse(
        localStorage.getItem("selectedCustomers") || "[]"
      );

      // Create a Set to track all unique email addresses
      const uniqueEmails = new Set();

      // STEP 1: Handle standard product groups
      if (currentSelectedGroups.includes("Alla kunder")) {
        currentCustomerGroups.allCustomers.forEach((customer) => {
          if (customer.email) {
            uniqueEmails.add(customer.email);
          }
        });
      } else {
        currentCustomerGroups.allCustomers
          .filter((customer) => {
            const isIncluded = currentSelectedGroups.includes(
              customer.goodsName
            );
            return isIncluded;
          })
          .forEach((customer) => {
            if (customer.email) {
              uniqueEmails.add(customer.email);
            }
          });
      }

      // STEP 2: Handle custom groups using data from localStorage
      currentSelectedGroups.forEach((groupName) => {
        const customGroup = currentCustomGroups[groupName];
        if (customGroup && customGroup.customers) {
          customGroup.customers.forEach((customer) => {
            if (customer.email) uniqueEmails.add(customer.email);
          });
        }
      });

      // STEP 3: Handle individually selected customers
      currentSelectedCustomers.forEach((customer) => {
        if (customer.email) uniqueEmails.add(customer.email);
      });

      // Convert Set to Array for processing
      const emailAddresses = Array.from(uniqueEmails);

      if (emailAddresses.length === 0) {
        setMessage(
          "Inga giltiga e-postadresser hittades i de valda grupperna eller för specifik kund."
        );
        return;
      }

      setRecipientsCount(emailAddresses.length);

      // Send emails to all recipients
      for (const email of emailAddresses) {
        try {
          const response = await axios.post(
            BASE_URL + MAIL_URL,
            {
              to: email,
              subject: subjectRef.current,
              html: htmlContent,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error("Error sending email, error: ", error);
          setMessage(`Fel vid utskick av e-post: ${error.message}`);
        }
      }

      setMessage(
        `E-postmeddelanden skickades framgångsrikt till ${emailAddresses.length} mottagare!`
      );
    } catch (error) {
      console.error("Error sending emails:", error);
      setMessage("Misslyckades med att skicka e-postmeddelanden.");
    } finally {
      setLoading(false);
    }
  };

    const handleSelectCustomerGroups = async () => {
    console.log("Fetching customer groups...");
    
    try {
      // Always fetch custom groups from localStorage
      const savedCustomGroups = JSON.parse(localStorage.getItem("customGroups")) || {};
      console.log("Saved custom groups:", savedCustomGroups);
  
      // Check if we need to fetch other data
      if (!customerGroups.allCustomers || customerGroups.allCustomers.length === 0) {
        const data = await fetchCustomersGroupedByGoods();
        console.log("Fetched data:", data);
        
        const combinedData = {
          allCustomers: data.allCustomers || [],
          goodsGroups: data.goodsGroups || [],
          customGroups: savedCustomGroups
        };
        
        console.log("Combined data:", combinedData);
        setCustomerGroups(combinedData);
        localStorage.setItem("customerGroups", JSON.stringify(combinedData));
      } else {
        // Just update the custom groups in the existing data
        setCustomerGroups(prevState => ({
          ...prevState,
          customGroups: savedCustomGroups
        }));
        
        // Update localStorage with the combined data
        const updatedData = {
          ...customerGroups,
          customGroups: savedCustomGroups
        };
        localStorage.setItem("customerGroups", JSON.stringify(updatedData));
      }
      
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error handling customer groups:", error);
    }
  };

  const handleCloseModal = (selectedGroups, selectedCustomers = []) => {
    setIsModalOpen(false);

    if (selectedGroups) {
      setSelectedGroups(selectedGroups);
      localStorage.setItem("selectedGroups", JSON.stringify(selectedGroups));
    }

    if (selectedCustomers) {
      setSelectedCustomers(selectedCustomers);
      localStorage.setItem(
        "selectedCustomers",
        JSON.stringify(selectedCustomers)
      );
    }
  };

  const handleCloseDialog = () => {
    setMessage("");
  };

  const handleSaveSubject = (newSubject) => {
    subjectRef.current = newSubject;
    setIsSubjectModalOpen(false);
  };

  return (
    <div className="mailingWrapper">
      <Typography variant="h2" className="pageHeader">
        Mailutskick
      </Typography>
      <Toolbar>
        <div id="mailControls">
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label htmlFor="fileInput">
            <Button
              variant="contained"
              color="primary"
              component="span"
              endIcon={<DownloadIcon />}
              sx={{ height: "100%" }}
            >
              Importera mall
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            endIcon={<GroupAddIcon />}
            onClick={handleSelectCustomerGroups}
          >
            Välj Kundgrupper
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SubjectIcon />}
            onClick={() => setIsSubjectModalOpen(true)}
          >
            Ange rubrik
          </Button>
          <Box sx={{ borderLeft: "1px solid #ccc", paddingLeft: 2 }}>
            <Typography variant="h6">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <GroupIcon sx={{ mr: 1 }} />
                {selectedGroups.includes("Alla kunder") ? (
                  "Alla kunder"
                ) : (
                  <>
                    {selectedGroups.length > 0
                      ? `${selectedGroups.length} grupper`
                      : "Inga grupper valda"}
                    {selectedCustomers.length > 0 &&
                      ` + ${selectedCustomers.length} enskilda kunder`}
                  </>
                )}
              </Box>
            </Typography>
            <Typography variant="h6">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <SubjectIcon sx={{ mr: 1 }} />
                {subjectRef.current ? subjectRef.current : "Ingen rubrik vald"}
              </Box>
            </Typography>
          </Box>
        </div>
        <Button
          variant="contained"
          color="primary"
          disabled={!subjectRef.current}
          onClick={async () => {
            if (!subjectRef.current) {
              setMessage(
                "Rubrik saknas. Vänligen ange en giltig rubrik innan du skickar e-post."
              );
              return;
            }
            try {
              const htmlContent = await emailBuilderRef.current.sendEmail();
              if (htmlContent) {
                await handleSendEmail(htmlContent);
              }
            } catch (error) {
              console.error("Error sending email:", error);
              setMessage("Ett fel uppstod vid försök att skicka e-post.");
            }
          }}
          endIcon={<SendIcon />}
        >
          Skicka mail
        </Button>
      </Toolbar>
      <Paper id="mailingPaper" elevation={3}>
        <EmailBuilder ref={emailBuilderRef} sendEmail={handleSendEmail} />
      </Paper>
      // Update the Modal component
      <Modal
        open={isModalOpen}
        onClose={() => handleCloseModal(selectedGroups, selectedCustomers)}
      >
        <Box>
          <SelectCustomerGroupModal
            customerGroups={customerGroups}
            onClose={(groups, customers) => {
              handleCloseModal(groups, customers);
              // Add a small delay before allowing send
              setTimeout(() => {
              }, 100);
            }}
            selectedGroups={selectedGroups}
            setSelectedGroups={setSelectedGroups}
            selectedCustomers={selectedCustomers}
            setSelectedCustomers={setSelectedCustomers}
          />
        </Box>
      </Modal>
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={handleSaveSubject}
      />
      <Dialog open={loading || message !== ""} onClose={handleCloseDialog}>
        <DialogContent className="standardDialog">
          <h2>{message}</h2>
          {loading && <LoadingCircle />}
          {!loading && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseDialog}
            >
              Stäng
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Mailing;
