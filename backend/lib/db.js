import mongoose from 'mongoose';

export const connectDB = async () => {
    try {   // Tries to use Mongoose package to be able to connect to our database.
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected: ${conn.connection.host}');
    } catch (error) {
        console.log('Error: ${error.message}');
        process.exit(1); // 1: Exit with Failure, 0: Success
    }
};