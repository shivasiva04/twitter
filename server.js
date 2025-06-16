import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cloudinary from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';

import notificationRoutes from "./backend/routes/notification.route.js";
import authRoute from './backend/routes/auth.route.js';
import userRoute from './backend/routes/user.route.js';
import postRoute from './backend/routes/post.route.js';
import connectDB from './backend/controllers/db/connectDB.js';

const app = express();
dotenv.config();

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB
connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'https://twitterdemo.onrender.com'], // for local + render frontend
    credentials: true
}));

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/notifications', notificationRoutes);

// Serve static frontend
const frontendPath = path.join(__dirname, './frontend/x-clone/dist');
app.use(express.static(frontendPath));

// Serve frontend on all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
