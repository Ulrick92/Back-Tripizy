const mongoose = require("mongoose");

const TipsModel = mongoose.model("Tips", {
  category: {
    type: String,
    required: true
  },
  compagny_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    maxlength: 100000
  },
  adress: {
    type: String,
    required: true
  },
  city: {
    type: String,
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
  photos: [String],
  videos: [String],
  description: {
    type: String,
    maxlength: 500
  },
  tel: Number,
  email: String,
  rate: [Number],
  comments: {
    type: [String],
    default: []
  },
  web_site: String,
  step_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Step"
  }
});

module.exports = TipsModel;
