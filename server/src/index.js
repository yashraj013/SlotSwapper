import 'dotenv/config';
import express from 'express';
import cors from 'cors';  
import cookieParser from 'cookie-parser';   
import connectDB from './db/db.js';

const app = express();

connectDB();

app.use(cors({
    origin: "http://localhost:5173",
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

import swapRequestRoutes from './routes/swapRequest.routes.js';
app.use('/api', swapRequestRoutes);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

