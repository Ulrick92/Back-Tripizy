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
    required: true
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
  description: String,
  tel: Number,
  email: String,
  rate: Number,
  comments: [String],
  web_site: String
});
