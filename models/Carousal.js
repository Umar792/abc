const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CarousalSliderSchema = new Schema({
  image: {
    type: String,
    required: [true, "Plaese select the image"],
  },
  heading: {
    type: String,
    // required: [true, "Plaese enter the heading text"],
  },
  paragraph: {
    type: String,
    required: [true, "Plaese enter the paragrah tex"],
  },
  event: [{}],
});

const CraousalModal = mongoose.model("carousal", CarousalSliderSchema);
module.exports = CraousalModal;
