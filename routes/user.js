const router = require("express").Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const isAuthenticated = require("../middlewares/isAuthenticated");
const UserModel = require("../models/User.js");
const TravelbookModel = require("../models/TravelBook");

// Route d'enregistrement
router.post("/sign_up", uploadPictures, (req, res) => {
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
    birthday: req.body.birthday,
    adress: req.body.adress,
    city: req.body.city,
    profile_pic: req.body.profile_pic,
    interest_area: req.body.interest_area,
    nationality: {
      country_name: req.body.country_name,
      country_flag: req.body.country_flag
    }
  });
  user.save((err, user) => {
    if (err) {
      return res.json(err.message);
    } else {
      return res.json(user);
    }
  });
});

// Route de connexion
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

// Route modification de profil
router.post("/edit/:id", isAuthenticated, uploadPictures, (req, res) => {
  const {
    first_name,
    last_name,
    birthday,
    email,
    adress,
    city,
    profile_pic,
    interest_area,
    nationality: { country_name, country_flag }
  } = req.body;
  const { id } = req.params;
  if (String(req.user._id) === id) {
    UserModel.findByIdAndUpdate(
      id,
      {
        $set: {
          first_name,
          last_name,
          birthday,
          email,
          adress,
          city,
          profile_pic,
          interest_area,
          nationality: {
            country_name,
            country_flag
          }
        }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          res.json(err.message);
        } else {
          res.json(updatedUser);
        }
      }
    );
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// Route suppression de profil
router.delete("/delete/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  if (String(req.user._id) === id) {
    UserModel.findOneAndDelete(id, function(err) {
      if (err) {
        res.json(err);
      } else {
        res.json("user deleted");
      }
    });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// Route consultation de profil
router.get("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  UserModel.findById(id)
    .populate("travelbooks")
    .exec((err, user) => {
      if (err) {
        res.status(400);
        return res.json(err.message);
      } else {
        if (!user) {
          res.status(404);
          return res.json("User not found");
        }
        return res.json(user);
      }
    });
});

module.exports = router;
