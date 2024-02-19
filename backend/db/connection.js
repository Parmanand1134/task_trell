// dbConnection.js

import mongoose from "mongoose";
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_PATH, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 30000,  // Set a higher timeout value (in milliseconds)

        });
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
};
export default connectToDatabase;

