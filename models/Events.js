const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  image: {
    type: String,
    // required: [true, "Plaese select the image"],
  },
  event: [{}],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  paragarph: {
    type: String,
  },
});

const EventModal = mongoose.model("EventModal", EventSchema);
module.exports = EventModal;
