/**
 * eventController.js är en fil som innehåller funktioner för att hantera evenemang i och från databasen
 */
const { getAllEvents } = require('../services/eventService');
const { getPublicEvents } = require('../services/apiServicePublicEvents');

/**
 * Hämtar alla evenemang från databasen
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchAllEvents = async (req, res) => {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

/**
 * Hämtar alla offentliga evenemang från databasen
 * @param {object} req - request objekt
 * @param {object} res - response objekt
 * @returns {Promise<void>} - inget returnerat
 */
const fetchUpcomingEvents = async (req, res) => {
    try {
        const events = await getPublicEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming events', error: error.message });
    }
};

//exporterar fetchAllEvents och fetchUpcomingEvents för att kunna använda dem i andra filer
module.exports = { fetchAllEvents, fetchUpcomingEvents };