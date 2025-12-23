const { MongoClient } = require('mongodb');

/**
 * Database Connection Module (Singleton Pattern)
 * Uses the native MongoDB driver for all database operations.
 */

let client = null;
let db = null;

/**
 * Connect to MongoDB using a singleton pattern.
 * Ensures only one connection instance exists throughout the application lifecycle.
 * @returns {Promise<Db>} The MongoDB database instance
 */
const connectDB = async () => {
    if (db) {
        // Return existing connection if already connected
        return db;
    }

    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        const dbName = process.env.DB_NAME || 'events_db';

        // Create a new MongoClient instance
        client = new MongoClient(uri);

        // Connect to the MongoDB server
        await client.connect();

        // Verify connection with a ping
        await client.db('admin').command({ ping: 1 });
        console.log('✅ Successfully connected to MongoDB');

        // Get the database instance
        db = client.db(dbName);

        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

/**
 * Get the current database instance.
 * @returns {Db|null} The MongoDB database instance or null if not connected
 */
const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB() first.');
    }
    return db;
};

/**
 * Close the MongoDB connection gracefully.
 */
const closeDB = async () => {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('🔌 MongoDB connection closed');
    }
};

module.exports = {
    connectDB,
    getDB,
    closeDB
};
