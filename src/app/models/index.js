import mongoose from "mongoose";
import { BootException } from "@common/exceptions/coreException.js";

async function connectToDatabase(uri, user, pass, database, options) {
    const defaultOptions = {}

    try {
        mongoose.connect(uri, {
            ...defaultOptions, ...options,
            user: user,
            pass: pass,
            dbName: database
        });

        /* Mongoose events */
        mongoose.connection.on('connected', () => console.log(`Successfully connected to database "${database}"`));
        mongoose.connection.on('open', () => console.log('MongoDB open'));
        mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));
        mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
        mongoose.connection.on('disconnecting', () => console.log('MongoDB disconnecting'));
        mongoose.connection.on('close', () => {
            throw new BootException('MongoDB connection closed');
        });

        process.on('SIGINT', () => {
            mongoose.connection.close();
        });
    } catch (error) {
        throw new BootException(error)
    }
}

export { connectToDatabase };