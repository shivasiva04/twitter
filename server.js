// server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cloudinary from 'cloudinary';
import notificationRoutes from "./backend/routes/notification.route.js";

// Routes
import authRoute from './backend/routes/auth.route.js';
import userRoute from './backend/routes/user.route.js';
import postRoute from './backend/routes/post.route.js';

// DB connection
import connectDB from './backend/controllers/db/connectDB.js';

const app = express();
dotenv.config();

// Middleware
app.use(express.json(
    {
        limit:"10mb"
    }
));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute); 
app.use("/api/notifications", notificationRoutes);


// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
