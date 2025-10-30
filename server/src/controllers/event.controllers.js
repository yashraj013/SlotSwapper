import eventModel from '../models/event.models.js';


// Create event
const createEvent = async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;

    const event = await eventModel.create({
      title,
      startTime,
      endTime,
      userId: req.user.id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events of the logged-in user
const getMyEvents = async (req, res) => {
  try {
    const events = await eventModel.find({ userId: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update event status or title
const updateEvent = async (req, res) => {
  try {
    const event = await eventModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await eventModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
    createEvent,
    getMyEvents,
    updateEvent,
    deleteEvent
}