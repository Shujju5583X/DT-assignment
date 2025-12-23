const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

/**
 * Event Controller
 * Handles all CRUD operations for Events using native MongoDB driver.
 */

const COLLECTION_NAME = 'events';

/**
 * GET /events?id=:event_id
 * Fetch a single event by its MongoDB _id
 */
const getEventById = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Event ID format'
            });
        }

        const db = getDB();
        const event = await db.collection(COLLECTION_NAME).findOne({
            _id: new ObjectId(id)
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * GET /events?type=latest&limit=5&page=1
 * Fetch events sorted by recency (descending) with pagination
 */
const getLatestEvents = async (req, res) => {
    try {
        const { limit = 5, page = 1 } = req.query;

        // Parse and validate pagination parameters
        const limitNum = parseInt(limit, 10);
        const pageNum = parseInt(page, 10);

        if (isNaN(limitNum) || limitNum < 1) {
            return res.status(400).json({
                success: false,
                message: 'Limit must be a positive integer'
            });
        }

        if (isNaN(pageNum) || pageNum < 1) {
            return res.status(400).json({
                success: false,
                message: 'Page must be a positive integer'
            });
        }

        const skip = (pageNum - 1) * limitNum;

        const db = getDB();

        // Get total count for pagination metadata
        const totalCount = await db.collection(COLLECTION_NAME).countDocuments();

        // Fetch events sorted by schedule (most recent first)
        const events = await db.collection(COLLECTION_NAME)
            .find({})
            .sort({ schedule: -1 })
            .skip(skip)
            .limit(limitNum)
            .toArray();

        res.status(200).json({
            success: true,
            data: events,
            pagination: {
                currentPage: pageNum,
                limit: limitNum,
                totalEvents: totalCount,
                totalPages: Math.ceil(totalCount / limitNum)
            }
        });
    } catch (error) {
        console.error('Error fetching latest events:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * POST /events
 * Create a new event
 */
const createEvent = async (req, res) => {
    try {
        const {
            uid,
            name,
            tagline,
            schedule,
            description,
            files,
            moderator,
            category,
            sub_category,
            rigor_rank,
            attendees
        } = req.body;

        // Basic validation for required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Event name is required'
            });
        }

        // Construct the event document
        const eventDocument = {
            type: 'event',
            uid: uid || null,
            name: name,
            tagline: tagline || '',
            schedule: schedule ? new Date(schedule) : new Date(),
            description: description || '',
            files: files || { image: null },
            moderator: moderator || null,
            category: category || '',
            sub_category: sub_category || '',
            rigor_rank: rigor_rank ? parseInt(rigor_rank, 10) : 0,
            attendees: Array.isArray(attendees) ? attendees : [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const db = getDB();
        const result = await db.collection(COLLECTION_NAME).insertOne(eventDocument);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: {
                _id: result.insertedId
            }
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * PUT /events/:id
 * Update an existing event by ID
 */
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Event ID format'
            });
        }

        const updateFields = req.body;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No update fields provided'
            });
        }

        // Prevent updating _id and type fields
        delete updateFields._id;
        delete updateFields.type;

        // Convert schedule to Date if provided
        if (updateFields.schedule) {
            updateFields.schedule = new Date(updateFields.schedule);
        }

        // Convert rigor_rank to integer if provided
        if (updateFields.rigor_rank !== undefined) {
            updateFields.rigor_rank = parseInt(updateFields.rigor_rank, 10);
        }

        // Add updatedAt timestamp
        updateFields.updatedAt = new Date();

        const db = getDB();
        const result = await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: {
                modifiedCount: result.modifiedCount
            }
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * DELETE /events/:id
 * Delete an event by ID
 */
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Event ID is required'
            });
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Event ID format'
            });
        }

        const db = getDB();
        const result = await db.collection(COLLECTION_NAME).deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    getEventById,
    getLatestEvents,
    createEvent,
    updateEvent,
    deleteEvent
};
