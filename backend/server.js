import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Routes
import authRoutes from './routes/auth.route.js';

// Lib
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());         // Allows us to parse the body of the request.
app.use(cookieParser());         // Allows us to get access to the cookies (cookies are used to remember personal information and for security/authentication).

// Authentication
app.use("/api/auth", authRoutes); // Allow us to accept json data in the req.body.


app.listen(PORT, () =>{
    console.log('Server started at http://localhost:'+ PORT);

    connectDB();                 // Connects to the MongoDB database. 
});