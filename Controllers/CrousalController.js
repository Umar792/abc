const CraousalModal = require("../models/Carousal");
const ErrorHandler = require("../utils/errorHandler");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

module.exports = {
  // ----- create the carousal
  createCarousal: async (req, res, next) => {
    try {
      const { heading, paragraph, event, isOverLay } = req.body;
      const parseEvent = JSON.parse(req.body.event);
      if (!paragraph || !event) {
        return next(
          new ErrorHandler("Plaese enter paragraph and select the event", 400)
        );
      }
      if (!req.file) {
        return next(new ErrorHandler("Plaese enter image for slider", 400));
      }
      if (req.file) {
        const file = req.file.filename;
        var fileUrl = path.join(file);
        // console.log(fileUrl);
      }
      await CraousalModal.create({
        event: parseEvent,
        paragraph: paragraph,
        image: fileUrl,
        isOverLay: isOverLay,
      });
      res.status(200).json({
        success: true,
        message: "Carousal created successfully",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
  //   ---- updte the carousal
  updateCrusal: async (req, res, next) => {
    try {
      // Find the carousel by ID
      const carousal = await CraousalModal.findById(req.params.id);

      // Check if the carousel exists
      if (!carousal) {
        return next(new ErrorHandler("Carousel not found", 404));
      }

      // Update carousel fields based on request body
      if (req.body.heading) {
        carousal.heading = req.body.heading;
      }

      if (req.body.paragraph) {
        carousal.paragraph = req.body.paragraph;
      }
      if (req.body.isOverLay) {
        carousal.isOverLay = req.body.isOverLay;
      }
      if (req.body.event) {
        const parseEvent = JSON.parse(req.body.event);
        carousal.event = parseEvent;
      }

      // Check if there is an uploaded image
      if (req.file) {
        const filepath = path.join(__dirname, "../uploads", carousal.image);
        fs.unlink(filepath, (err) => {
          if (err) {
            console.log(`Error in file deleting ${err}`);
            // res.status(400).json({ message: "Error in file deleting" });
          } else {
            console.log("file deleted successfuly");

            // res.status(400).json({ message: "file deleting" });
          }
        });
        const file = req.file.filename;
        const fileUrl = path.join(file);
        carousal.image = fileUrl;
      }

      // Save the updated carousel
      await carousal.save();

      // Respond with success message
      res.status(200).json({
        success: true,
        message: "Carousel updated successfully",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
  // ------ get all events
  GetCraousal: async (req, res, next) => {
    try {
      const events = await CraousalModal.find();
      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  },
  // ---- delete carousal
  DeleteCarousal: async (req, res, next) => {
    try {
      const event = await CraousalModal.findById(req.params.id);

      if (!event) {
        return next(new ErrorHandler("No Event found", 400));
      }
      await CraousalModal.findByIdAndDelete(req.params.id);
      if (event.image) {
        const filepath = path.join(__dirname, "../uploads", event.image);
        console.log(filepath);
        fs.unlink(filepath, async (err) => {
          if (err) {
            console.log(`Error in file deleting ${err}`);
            return res.status(400).json({ message: "Error in file deleting" });
          }

          console.log("File deleted successfully");
          res.status(200).json({
            success: true,
            message: "Carousal deleted successfully",
          });
        });
      }
    } catch (error) {
      console.log(error);
      next(new ErrorHandler(error.message, 400));
    }
  },
};

cron.schedule("0 0 * * *", async () => {
  try {
    const carousals = await CraousalModal.find();
    carousals.forEach(async (carousal) => {
      carousal.event.forEach(async (event) => {
        if (Date.now() > new Date(event?.occurs_at).getTime() + 86400000) {
          const filepath = path.join(__dirname, "../uploads", carousal.image);
          fs.unlink(filepath, async (err) => {
            if (err) {
              console.log(`Error in file deleting ${err}`);
            } else {
              console.log("File deleted successfully");

              // Delete the carousal from the database
              await CraousalModal.findByIdAndDelete(carousal._id);
              console.log("Carousal deleted successfully");
            }
          });
        }
      });
    });
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
