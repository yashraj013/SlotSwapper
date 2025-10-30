import express from 'express';
import { createEvent } from '../controllers/event.controllers.js';
import { getMyEvents } from '../controllers/event.controllers.js';
import { updateEvent } from '../controllers/event.controllers.js';
import { deleteEvent } from '../controllers/event.controllers.js';

import { authMiddleware } from '../middlewares/user.middlewares.js';

const router = express.Router();

// Event Routes
router.post('/event/create', authMiddleware, createEvent);
router.get('/event/getEvents', authMiddleware, getMyEvents);
router.put('/event/update/:id', authMiddleware, updateEvent);
router.delete('/event/delete/:id', authMiddleware, deleteEvent);

export default router;