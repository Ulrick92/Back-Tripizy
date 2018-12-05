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
    required: true
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
  followers: [String],
  token: String,
  hash: String,
  salt: String
});

module.exports = UserModel;
