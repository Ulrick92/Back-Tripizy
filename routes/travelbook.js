const router = require("express").Router();
const TravelBookModel = require("../models/TravelBook");
const UserModel = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");
const ObjectId = require("mongoose").Types.ObjectId;

// Route Create
router.post("/publish", isAuthenticated, (req, res) => {
  const {
    country,
    city,
    category,
    start_date,
    end_date,
    title,
    description,
    photos
  } = req.body;
  const newTravelBook = new TravelBookModel({
    country,
    city,
    category,
    start_date,
    end_date,
    title,
    description,
    photos,
    user_id: req.user,
    steps: []
  });
  for (let i = 0; i < req.user.travelbooks.length; i++) {
    if (req.user.travelbooks[i].title === title) {
      return res.status(400).json({
        error: "Ce travelbook a déjà été ajouté."
      });
    }
  }
  newTravelBook.save(function(err, travelBook) {
    req.user.travelbooks.push(travelBook._id);
    req.user.save();
    res.json({
      travelBook
    });
  });
});

// Route Read
router.get("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  TravelBookModel.findById(id)
    .populate("steps")
    .exec((err, travelbook) => {
      if (err) {
        res.status(400);
        return res.json(err.message);
      } else {
        if (!travelbook) {
          res.status(404);
          return res.json("Travelbook not found");
        }
        return res.json(travelbook);
      }
    });
});

// Route Update
router.post("/edit/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const {
    country,
    city,
    category,
    start_date,
    end_date,
    title,
    description,
    photos
  } = req.body;
  TravelBookModel.findByIdAndUpdate(
    id,
    {
      $set: {
        country,
        city,
        category,
        start_date,
        end_date,
        title,
        description,
        photos
      }
    },
    { new: true },
    (err, updatedTravelBook) => {
      if (err) {
        res.json(err.message);
      } else {
        res.json(updatedTravelBook);
      }
    }
  );
});

// Route Delete
router.delete("/delete/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  for (let i = 0; i < req.user.travelbooks.length; i++) {
    if (String(req.user.travelbooks[i]._id) === id) {
      req.user.travelbooks.splice(i, 1);
    }
  }
  req.user.save(err => {
    TravelBookModel.findByIdAndRemove(id).exec((err, obj) => {
      if (err) {
        res.json(err);
      }
      if (!obj) {
        res.status(404);
        res.json("Nothing to delete");
      } else {
        res.json("Travelbook deleted");
      }
    });
  });
});

// Route List
router.get("/", isAuthenticated, (req, res) => {
  TravelBookModel.find({})
    .populate("user_id")
    .exec((err, travelbook) => {
      res.json(travelbook);
    });
});

module.exports = router;
