const mongoose = require("mongoose");
const TravelBookModel = mongoose.model("TravelBook", {
  country: {
    type: [String],
    require: true
  },
  category: {
    type: [String],
    require: true
  },
  start_date: {
    type: Date,
    require: true
  },
  end_date: {
    type: Date,
    require: true
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
    require: true
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
