const router = require("express").Router();
const TravelBookModel = require("../models/TravelBook");
const isAuthenticated = require("../middlewares/isAuthenticated");
const ObjsectId = require("mongoose").Types.ObjectId;

router.get("/", isAuthenticated, (req, res) => {
  TravelBookModel.find({}).exec((err, travelbook) => {
    res.json(travelbook);
  });
});

router.post("/publish", isAuthenticated, (req, res) => {});

module.exports = router;
