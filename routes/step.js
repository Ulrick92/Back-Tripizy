const router = require("express").Router();
const StepModel = require("../models/Step");
const TravelBookModel = require("../models/TravelBook");
const isAuthenticated = require("../middlewares/isAuthenticated");
const ObjectId = require("mongoose").Types.ObjectId;

// Route Create
router.post("/publish", isAuthenticated, (req, res) => {
  const {
    start_date,
    end_date,
    title,
    description,
    current_point,
    photos,
    videos,
    id
  } = req.body;
  const newStep = new StepModel({
    start_date,
    end_date,
    title,
    description,
    current_point,
    photos,
    videos
  });
  TravelBookModel.findOne({ _id: id })
    .populate("steps")
    .exec(function(err, travelbookfound) {
      if (!travelbookfound) {
        return res.status(400).json({
          error: {
            message: "Cette Travelbook n'existe pas"
          }
        });
      }
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
router.post("/edit/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const {
    start_date,
    end_date,
    title,
    description,
    current_point,
    photos,
    videos
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
        videos
      }
    },
    { new: true },
    (err, updatedStep) => {
      if (err) {
        res.json(err.message);
      } else {
        // res.redirect("/:id");
        res.json(updatedStep);
      }
    }
  );
});

// Route Delete
router.delete("/delete/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  StepModel.findByIdAndRemove(
    { _id: ObjectId(id), travelbook_id: TravelBookModel },
    function(err, obj) {
      if (err) {
        res.json(err);
      }
      if (!obj) {
        res.status(404);
        res.json("Nothing to delete");
      } else {
        res.json("Step deleted");
      }
    }
  );
});

module.exports = router;
