import eventModel from "../models/event.models.js";
import swapRequestModel from "../models/swapRequest.models.js";


const getSwappableSlots = async (req, res) => {
  try {
    const swappableSlots = await eventModel.find({
      userId: { $ne: req.user.id },
      status: "SWAPPABLE",
    }).populate("userId", "name email");

    res.json(swappableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSwapRequest = async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;

    const mySlot = await eventModel.findOne({ _id: mySlotId, userId: req.user.id });
    const theirSlot = await eventModel.findById(theirSlotId);

    if (!mySlot || !theirSlot)
      return res.status(404).json({ message: "Slot not found" });

    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE")
      return res.status(400).json({ message: "Slots not swappable" });

    // Create swap request
    const swapRequest = await swapRequestModel.create({
      mySlotId,
      theirSlotId,
      requesterId: req.user.id,
      receiverId: theirSlot.userId,
      status: "PENDING",
    });

    // Update both slots to SWAP_PENDING
    mySlot.status = "SWAP_PENDING";
    theirSlot.status = "SWAP_PENDING";
    await mySlot.save();
    await theirSlot.save();

    res.status(201).json(swapRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const respondToSwapRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { accept } = req.body;

    const swap = await swapRequestModel.findById(requestId)
      .populate("mySlotId")
      .populate("theirSlotId");

    if (!swap) return res.status(404).json({ message: "Swap request not found" });

    const mySlot = await eventModel.findById(swap.mySlotId);
    const theirSlot = await eventModel.findById(swap.theirSlotId);

    if (!mySlot || !theirSlot)
      return res.status(404).json({ message: "Slots not found" });

    if (accept) {
      //  Accepted → Swap user ownership
      const tempUser = mySlot.userId;
      mySlot.userId = theirSlot.userId;
      theirSlot.userId = tempUser;

      mySlot.status = "BUSY";
      theirSlot.status = "BUSY";
      swap.status = "ACCEPTED";

      await mySlot.save();
      await theirSlot.save();
      await swap.save();

      return res.json({ message: "Swap accepted successfully" });
    } else {
      //  Rejected → revert status
      mySlot.status = "SWAPPABLE";
      theirSlot.status = "SWAPPABLE";
      swap.status = "REJECTED";

      await mySlot.save();
      await theirSlot.save();
      await swap.save();

      return res.json({ message: "Swap rejected" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    const requests = await swapRequestModel
      .find({ receiverId: req.user.id })
      .populate('mySlotId')
      .populate('theirSlotId')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOutgoingRequests = async (req, res) => {
  try {
    const requests = await swapRequestModel
      .find({ requesterId: req.user.id })
      .populate('mySlotId')
      .populate('theirSlotId')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
    getSwappableSlots,
    createSwapRequest,
    respondToSwapRequest,
    getOutgoingRequests,
    getIncomingRequests

};