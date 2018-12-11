const router = require("express").Router();
const StepModel = require("../models/Step");
const TravelBookModel = require("../models/TravelBook");
const uploadPictures = require("../middlewares/uploadPictures");
const isAuthenticated = require("../middlewares/isAuthenticated");
const ObjectId = require("mongoose").Types.ObjectId;

// Route Create
router.post("/publish", isAuthenticated, uploadPictures, (req, res) => {
  const {
    start_date,
    end_date,
    title,
    description,
    current_point,
    photos,
    videos,
    travelbook_id,
    city
  } = req.body;
  const newStep = new StepModel({
    start_date,
    end_date,
    title,
    description,
    current_point,
    photos,
    videos,
    travelbook_id,
    city,
    tips: []
  });
  TravelBookModel.findById(travelbook_id)
    .populate("steps")
    .exec(function(err, travelbookfound) {
      if (!travelbookfound) {
        return res.status(400).json({
          error: {
            message: "Cette Travelbook n'existe pas"
          }
        });
      }
      // Les step pourront avoir le même titre
      newStep.save(function(err, step) {
        travelbookfound.steps.push(step._id);
        travelbookfound.save();
        res.json({
          message: "La step a bien été ajouté."
        });
      });
    });
});

// Route Read
router.get("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  StepModel.findById(id)
    .populate("tips")
    .exec((err, step) => {
      if (err) {
        res.status(400);
        return res.json(err.message);
      } else {
        if (!step) {
          res.status(404);
          return res.json("Step not found");
        }
        return res.json(step);
      }
    });
});

// Route Update
router.post("/edit/:id", isAuthenticated, uploadPictures, (req, res) => {
  const { id } = req.params;
  const {
    start_date,
    end_date,
    title,
    description,
    current_point,
    photos,
    videos,
    city
  } = req.body;
  StepModel.findByIdAndUpdate(
    id,
    {
      $set: {
        start_date,
        end_date,
        title,
        description,
        current_point,
        photos,
        videos,
        city
      }
    },
    { new: true },
    (err, updatedStep) => {
      if (err) {
        res.json(err.message);
      } else {
        res.json(updatedStep);
      }
    }
  );
});

// Route Delete
router.delete("/delete/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { travelbook_id } = req.body;
  TravelBookModel.findById(travelbook_id).exec((err, travrelbook) => {
    for (let i = 0; i < travrelbook.steps.length; i++) {
      if (String(travrelbook.steps[i]) === id) {
        travrelbook.steps.splice(i, 1);
      }
    }
    travrelbook.save(err => {
      StepModel.findOneAndDelete(id).exec((err, obj) => {
        if (err) {
          res.json(err);
        }
        if (!obj) {
          res.status(404);
          res.json("Nothing to delete");
        } else {
          res.json("Step deleted");
        }
      });
    });
  });
});

// Route List
router.get("/", isAuthenticated, (req, res) => {
  StepModel.find({})
    .populate("tips")
    .exec((err, step) => {
      res.json(step);
    });
});

module.exports = router;
