const router = require("express").Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const UserModel = require("../models/User.js");

router.post("/sign_up", (req, res) => {
  const token = uid2(64);
  const salt = uid2(64);
  const hash = SHA256(req.body.password + salt).toString(encBase64);

  const user = new UserModel({
    email: req.body.email,
    token: token,
    salt: salt,
    hash: hash,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    nationality: req.body.nationality,
    birthday: req.body.birthday,
    adress: req.body.adress,
    city: req.body.city,
    profile_pic: req.body.profile_pic,
    interest_area: req.body.interest_area,
    travelbooks: [],
    followers: []
  });
  user.save((err, user) => {
    if (err) {
      return res.json(err.message);
    } else {
      return res.json(user);
    }
  });
});

router.post("/log_in", (req, res) => {
  UserModel.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) return res.json(err.message);
    if (user) {
      if (
        SHA256(req.body.password + user.salt).toString(encBase64) === user.hash
      ) {
        return res.json(user);
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return res.json("User not found");
    }
  });
});

router.get("/:id", isAuthenticated, (req, res) => {
  User.findById(req.params.id)
    .exec()
    .then(function(user) {
      if (!user) {
        res.status(404);
        return res.json("User not found");
      }

      return res.json({
        _id: user._id,
        account: user.account
      });
    })
    .catch(function(err) {
      res.status(400);
      return res.json(err.message);
    });
});

module.exports = router;
