import React, { useRef } from "react";
import {
  Paper,
  Typography,
  SendIcon,
  DownloadIcon,
  GroupAddIcon,
} from "../utils/MaterialUI";
import Toolbar from "../components/Toolbar";
import EmailBuilder from "../components/Emailbuilder";
import Button from "../components/Button";
import axios from "axios";

const Mailing = () => {
  const emailBuilderRef = useRef(null);

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
        "http://localhost:3000/admin/send-email",
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
              endIcon={<DownloadIcon/>}
            >
              Importera mall
            </Button>
          </label>
          <Button variant="contained" color="primary"
          endIcon={<GroupAddIcon/>}>
            Välj Kundgrupper
          </Button>
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
    </div>
  );
};

export default Mailing;
