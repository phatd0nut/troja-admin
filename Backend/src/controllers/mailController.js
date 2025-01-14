/**
 * mailController.js är en fil som innehåller funktioner för att skicka e-post
 */
const { sendEmail } = require('../services/mailService');

/**
 * Skickar ett e-postmeddelande till en given mottagare
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const sendMail = async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    await sendEmail(to, subject, html);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
};

//exporterar sendMail för att kunna använda den i andra filer
module.exports = { sendMail };