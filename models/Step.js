const mongoose = require("mongoose");

const StepModel = mongoose.model("Step", {
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  // starting_point : String,
  // arrival_point : String,
  current_point: [Number],
  photos: [String],
  videos: [String],
  tips: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tips"
    }
  ]
});
