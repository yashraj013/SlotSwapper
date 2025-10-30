import express from 'express';
import { createSwapRequest } from '../controllers/swapRequest.controllers.js';
import { getSwappableSlots } from '../controllers/swapRequest.controllers.js';
import { respondToSwapRequest } from '../controllers/swapRequest.controllers.js';

import { authMiddleware } from '../middlewares/user.middlewares.js';

const router = express.Router();

// Swap Request Routes
router.get('/swap/slots', authMiddleware, getSwappableSlots);
router.post('/swap/create', authMiddleware, createSwapRequest);
router.post('/swap/respond/:requestId', authMiddleware, respondToSwapRequest);  

export default router;