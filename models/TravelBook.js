const mongoose = require("mongoose");
const TravelBookModel = mongoose.model("TravelBook", {
  country: {
    type: [String],
    required: true
  },
  city: {
    type: [String],
    required: true
  },
  category: {
    type: [String],
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  steps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Step"
    }
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    minlength: 1,
    maxlength: 50,
    required: true,
    unique: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  photos: [String],
  like: {
    type: Number,
    default: 0
  }
});

module.exports = TravelBookModel;
