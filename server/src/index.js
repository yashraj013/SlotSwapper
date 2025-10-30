import 'dotenv/config';
import express from 'express';
import cors from 'cors';  
import cookieParser from 'cookie-parser';   
import connectDB from './db/db.js';

const app = express();

connectDB();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("API Working")
})

import userRoutes from './routes/user.routes.js';
app.use('/api', userRoutes);

import eventRoutes from './routes/event.routes.js';
app.use('/api', eventRoutes);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

