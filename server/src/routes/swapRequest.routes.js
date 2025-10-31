import express from 'express';
import { createSwapRequest } from '../controllers/swapRequest.controllers.js';
import { getSwappableSlots } from '../controllers/swapRequest.controllers.js';
import { respondToSwapRequest } from '../controllers/swapRequest.controllers.js';
import { getIncomingRequests } from '../controllers/swapRequest.controllers.js';
import { getOutgoingRequests } from '../controllers/swapRequest.controllers.js';

import { authMiddleware } from '../middlewares/user.middlewares.js';

const router = express.Router();

// Swap Request Routes
router.get('/swap/slots', authMiddleware, getSwappableSlots);
router.post('/swap/create', authMiddleware, createSwapRequest);
router.post('/swap/respond/:requestId', authMiddleware, respondToSwapRequest);

// Spec-aligned aliases for client
router.get('/swappable-slots', authMiddleware, getSwappableSlots);
router.post('/swap-request', authMiddleware, createSwapRequest);
router.post('/swap-response/:requestId', authMiddleware, respondToSwapRequest);

router.get('/swap/incoming', authMiddleware, getIncomingRequests);
router.get('/swap/outgoing', authMiddleware, getOutgoingRequests);

export default router;