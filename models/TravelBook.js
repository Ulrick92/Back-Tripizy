const mongoose = required("mongoose");
const TravelBookModel = mongoose.model("TravelBook", {
  country: {
    type: Number,
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
    required: true
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
