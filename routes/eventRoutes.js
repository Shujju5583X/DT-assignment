const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

/**
 * Event Routes
 * Base URL: /api/v3/app
 */

/**
 * GET /events
 * Handles two query patterns:
 * 1. ?id=:event_id - Fetch event by MongoDB _id
 * 2. ?type=latest&limit=5&page=1 - Fetch paginated latest events
 */
router.get('/events', (req, res) => {
    const { id, type } = req.query;

    if (id) {
        // Fetch single event by ID
        return eventController.getEventById(req, res);
    } else if (type === 'latest') {
        // Fetch latest events with pagination
        return eventController.getLatestEvents(req, res);
    } else {
        // Default: return latest events
        return eventController.getLatestEvents(req, res);
    }
});

/**
 * POST /events
 * Create a new event
 */
router.post('/events', eventController.createEvent);

/**
 * PUT /events/:id
 * Update an existing event by ID
 */
router.put('/events/:id', eventController.updateEvent);

/**
 * DELETE /events/:id
 * Delete an event by ID
 */
router.delete('/events/:id', eventController.deleteEvent);

module.exports = router;
