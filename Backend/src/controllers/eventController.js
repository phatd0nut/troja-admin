const { getAllEvents } = require('../services/eventService');
const { getPublicEvents } = require('../services/apiServicePublicEvents');

const fetchAllEvents = async (req, res) => {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

const fetchUpcomingEvents = async (req, res) => {
    try {
        const events = await getPublicEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching upcoming events', error: error.message });
    }
};

module.exports = { fetchAllEvents, fetchUpcomingEvents };