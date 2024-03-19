const EventModal = require("../models/Events");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path");
const fs = require("fs");

module.exports = {
  // ----- create event
  createEevent: async (req, res, next) => {
    try {
      const { event, isFeatured, paragarph } = req.body;
      if (!event) {
        return next(new ErrorHandler("Please Enter Event", 400));
      }
      if (!req.file) {
        return next(new ErrorHandler("Please Enter image for event", 400));
      }
      if (req.file) {
        const file = req.file.filename;
        const fileUrl = path.join(file);
        await EventModal.create({
          event: JSON.parse(event),
          image: fileUrl,
          isFeatured,
          paragarph,
        });
        const allEvents = await EventModal.find();

        res.status(200).json({
          success: true,
          message: "Event Created successfully",
          allEvents,
        });
      }
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
  //   ---- get all events
  getAllEvents: async (req, res, next) => {
    try {
      const events = await EventModal.find();
      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
  //   ---- delete event
  deleteEvent: async (req, res, next) => {
    try {
      const event = await EventModal.findById(req.params.id);
      if (!event) {
        return next(new ErrorHandler("Event not found", 400));
      }
      await EventModal.findByIdAndDelete(req.params.id);
      if (event.image) {
        const filepath = path.join(__dirname, "../uploads", event.image);
        fs.unlink(filepath, (err) => {
          if (err) {
            console.log(`Error in file deleting ${err}`);
            return res.status(400).json({ message: "Error in file deleting" });
          }
          console.log("File deleted successfully");
        });
      }
      const events = await EventModal.find();
      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
        events,
      });
    } catch (error) {
      next(new Error(error.message, 400));
    }
  },
};
