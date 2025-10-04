import express from 'express';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.route.js';

// Lib
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Authentication
app.use("/api/auth", authRoutes); // Allow us to accept json data in the req.body.


app.listen(PORT, () =>{
    console.log('Server started at http://localhost:'+ PORT);

    connectDB();                 // Connects to the MongoDB database. 
});