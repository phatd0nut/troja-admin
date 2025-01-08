const { Resend } = require('resend');
const dotenv = require('dotenv');
const path = require('path');

// Ladda miljövariabler från .env-filen i rotmappen
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const resend = new Resend(process.env.R_CLIENT);
// const senderAdress = newsletterAddress || "no-reply@troja-ljungby.com"

const sendEmail = async (to, subject, htmlContent) => {
  console.log('Sending email to:', to);

  try {
    const response = await resend.emails.send({
      from: "no-reply@troja-ljungby.com",
      to,
      subject,
      html: htmlContent,
    });
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };