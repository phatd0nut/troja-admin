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

const Mailing = () => {
  const emailBuilderRef = useRef(null);
  const subjectRef = useRef(""); // Add subject ref
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const MAIL_URL = import.meta.env.VITE_SEND_MAIL_ENDPOINT;
  const [customerGroups, setCustomerGroups] = useState({
    allCustomers: [],
    customersWithAcceptInfo: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [recipientsCount, setRecipientsCount] = useState(0);
  console.log(subjectRef.current);

  // Hämta sparade grupper från localStorage när komponenten laddas
  useEffect(() => {
    const savedGroups =
      JSON.parse(localStorage.getItem("selectedGroups")) || [];
    setSelectedGroups(savedGroups);
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

  // Använd testadresser för att skicka e-post
  const testEmailAddresses = ["ez222dc@student.lnu.se"];

  // Testfunktion för att logga e-postadresser
  const logEmailAddresses = () => {
    // Samla in e-postadresser från valda kundgrupper inom customersWithAcceptInfo
    const emailAddresses = customerGroups.customersWithAcceptInfo
      .filter((customer) => selectedGroups.includes(customer.goodsName))
      .map((customer) => customer.email);

    console.log("Selected email addresses:", emailAddresses);
    console.log("With subject:", subject);
  };

  const handleSendEmail = async (htmlContent) => {
    if (!htmlContent || !subjectRef.current) {
      console.log("Missing content or subject");
      return;
    }

    console.log("Subject:", subjectRef.current);
    setLoading(true);
    setMessage("Skickar e-postmeddelanden...");

    try {
      const token = localStorage.getItem("token");
      // Samla in e-postadresser från valda kundgrupper inom customersWithAcceptInfo
      const emailAddresses = customerGroups.customersWithAcceptInfo
        .filter((customer) => selectedGroups.includes(customer.goodsName))
        .map((customer) => customer.email);

      setRecipientsCount(emailAddresses.length);

      // Skicka en separat begäran för varje e-postadress
      for (const email of testEmailAddresses) {
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
          console.log(`Email sent successfully to ${email}:`, response.data);
        } catch (error) {
          console.error("Error sending email, error: ", error);
          setMessage(`Fel vid utskick av e-post: ${error.message}`);
        }
      }

      setMessage(
        `E-postmeddelanden skickades framgångsrikt till ${testEmailAddresses.length} mottagare!`
      );
    } catch (error) {
      console.error("Error sending emails:", error);
      setMessage("Misslyckades med att skicka e-postmeddelanden.");
    } finally {
      setLoading(false); // Göm dialogen när alla e-postmeddelanden har skickats
    }
  };

  const handleSelectCustomerGroups = async () => {
    try {
      const data = await fetchCustomersGroupedByGoods();
      setCustomerGroups(data);
      setIsModalOpen(true); // Öppna modalen när data har hämtats
    } catch (error) {
      console.error("Error fetching customer groups:", error);
    }
  };

  const handleCloseModal = (selectedGroups) => {
    setIsModalOpen(false);
    if (selectedGroups) {
      setSelectedGroups(selectedGroups);
      localStorage.setItem("selectedGroups", JSON.stringify(selectedGroups));
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
                {selectedGroups.length > 0
                  ? `${selectedGroups.length}`
                  : "Inga kundgrupper valda"}
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
      <Modal
        open={isModalOpen}
        onClose={() => handleCloseModal(selectedGroups)}
      >
        <Box>
          <SelectCustomerGroupModal
            customerGroups={customerGroups}
            onClose={handleCloseModal}
            selectedGroups={selectedGroups}
            setSelectedGroups={setSelectedGroups}
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
