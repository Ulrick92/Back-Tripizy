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
    type: Date,
    required: true
  },
  nationality: String,
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
      ref: "TravelBook",
      default: []
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
