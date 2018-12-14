const mongoose = require("mongoose");

const UserModel = mongoose.model("User", {
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  birthday: {
    type: Date
  },
  nationality: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  adress: String,
  city: String,
  profile_pic: [String],
  travelbooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelBook"
    }
  ],
  interest_area: [String],
  followers: {
    type: [String],
    default: []
  },
  token: String,
  hash: String,
  salt: String
});

module.exports = UserModel;
