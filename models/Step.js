const mongoose = require("mongoose");

const StepModel = mongoose.model("Step", {
  start_date: {
    type: Date,
    require: true
  },
  end_date: {
    type: Date,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  city: {
    type: [String],
    require: true
  },
  description: String,
  current_point: [Number],
  photos: [String],
  videos: [String],
  tips: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tips"
    }
  ],
  travelbook_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TravelBook"
  }
});

module.exports = StepModel;
