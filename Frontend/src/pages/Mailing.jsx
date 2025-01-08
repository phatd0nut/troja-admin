import React, { useRef, useState } from "react";
import {
  Paper,
  Typography,
  SendIcon,
  DownloadIcon,
  GroupIcon,
  GroupAddIcon,
  Modal,
  Box,
} from "../utils/MaterialUI";
import Toolbar from "../components/Toolbar";
import EmailBuilder from "../components/Emailbuilder";
import Button from "../components/Button";
import axios from "axios";
import { fetchCustomersGroupedByGoods } from "../services/customerService";
import SelectCustomerGroupModal from "../components/SelectCustomerGroupModal";

const Mailing = () => {
  const emailBuilderRef = useRef(null);
  const mailUrl = import.meta.env.VITE_SEND_MAIL_ENDPOINT;
  const [customerGroups, setCustomerGroups] = useState({
    allCustomers: [],
    customersWithAcceptInfo: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

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

  const sendEmail = async (htmlContent) => {
    console.log("Sending email with content");
    try {
      // Hämta JWT-token från lokal lagring
      const token = localStorage.getItem("token");

      console.log(token);

      // Skicka POST-förfrågan till backendens mailservice med autentisering
      const response = await axios.post(
        mailUrl,
        {
          to: "ez222dc@student.lnu.se",
          subject: "Test Email",
          html: htmlContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          <Typography variant="h6" sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
            <GroupIcon sx={{ mr: 1 }} />Valda grupper för utskick: {selectedGroups.length}
            </Box>
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            await emailBuilderRef.current.sendEmail();
          }}
          endIcon={<SendIcon />}
        >
          Skicka mail
        </Button>
      </Toolbar>
      <Paper id="mailingPaper" elevation={3}>
        <EmailBuilder ref={emailBuilderRef} sendEmail={sendEmail} />
      </Paper>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box>
          <SelectCustomerGroupModal
            customerGroups={customerGroups}
            onClose={handleCloseModal}
            selectedGroups={selectedGroups}
            setSelectedGroups={setSelectedGroups}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default Mailing;
