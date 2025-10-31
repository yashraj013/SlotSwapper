import eventModel from "../models/event.models.js";
import swapRequestModel from "../models/swapRequest.models.js";


const getSwappableSlots = async (req, res) => {
  try {
    const swappableSlots = await eventModel.find({
      userId: { $ne: req.user.id },
      status: "SWAPPABLE",
    }).populate("userId", "username email");

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

    // prevent self-swap
    if (theirSlot.userId.toString() === req.user.id)
      return res.status(400).json({ message: "Cannot swap with your own slot" });

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

    // Only the receiver can respond
    if (swap.receiverId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to respond to this request" });

    // Must be pending
    if (swap.status !== "PENDING")
      return res.status(400).json({ message: "Swap request is not pending" });

    const mySlot = swap.mySlotId; // populated doc
    const theirSlot = swap.theirSlotId; // populated doc

    if (!mySlot || !theirSlot)
      return res.status(404).json({ message: "Slots not found" });

    // ensure both are still pending for swap
    if (accept && (mySlot.status !== "SWAP_PENDING" || theirSlot.status !== "SWAP_PENDING"))
      return res.status(400).json({ message: "Slots are not pending for swap" });

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
      //  Rejected → revert status only if they were on hold
      if (mySlot.status === "SWAP_PENDING") mySlot.status = "SWAPPABLE";
      if (theirSlot.status === "SWAP_PENDING") theirSlot.status = "SWAPPABLE";
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