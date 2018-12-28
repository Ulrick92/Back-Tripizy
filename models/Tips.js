const mongoose = require("mongoose");

const TipsModel = mongoose.model("Tips", {
  category: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    min: 0,
    maxlength: 100000
  },
  adress: {
    type: String
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
  },
  loc: {
    type: [Number], // [Longitude , latitude]
    index: "2d",
    default: [-85.584363, 10.260968]
  }
});

module.exports = TipsModel;
