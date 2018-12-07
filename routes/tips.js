const router = require("express").Router();
const TipsModel = require("../models/Tips");
const StepModel = require("../models/Step");
const isAuthenticated = require("../middlewares/isAuthenticated");
const ObjsectId = require("mongoose").Types.ObjectId;

// Route Create
router.post("/publish", isAuthenticated, (req, res) => {
  const {
    category,
    compagny_name,
    price,
    adress,
    city,
    start_date,
    end_date,
    photos,
    videos,
    description,
    tel,
    email,
    rate,
    web_site,
    step_id
  } = req.body;
  const newTips = new TipsModel({
    category,
    compagny_name,
    price,
    adress,
    city,
    start_date,
    end_date,
    photos,
    videos,
    description,
    tel,
    email,
    rate,
    web_site
  });
  StepModel.findById(step_id)
    .exec(populate)
    .exec((err, stepfound) => {
      for (let i = 0; i < stepfound.tips.length; i++) {
        if (stepfound.tips[i].compagny_name === compagny_name) {
          return res.status(400).json({
            error: "Ce tips a déjà été ajouté."
          });
        }
      }
      newTips.save(function(err, tips) {
        stepfound.tips.push(tips._id);
        stepfound.save();
        res.json({
          message: "Le tips a bien été ajouté."
        });
      });
    });
});

// Route Read
router.get("/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  TipsModel.findById(id).exec((err, tips) => {
    if (err) {
      res.status(400);
      return res.json(err.message);
    } else {
      if (!tips) {
        res.status(404);
        return res.json("Tips not found");
      }
      return res.json(tips);
    }
  });
});

// Route Update
router.post("/edit/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const {
    category,
    compagny_name,
    price,
    adress,
    city,
    start_date,
    end_date,
    photos,
    videos,
    description,
    tel,
    email,
    web_site
  } = req.body;
  TipsModel.findByIdAndUpdate(
    id,
    {
      $set: {
        category,
        compagny_name,
        price,
        adress,
        city,
        start_date,
        end_date,
        photos,
        videos,
        description,
        tel,
        email,
        web_site
      }
    },
    { new: true },
    (err, updatedTips) => {
      if (err) {
        res.json(err.message);
      } else {
        res.json(updatedTips);
      }
    }
  );
});

// Route Delete
router.delete("/delete/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { step_id } = req.body;
  StepModel.findById(step_id).exec((err, stepfound) => {
    for (let i = 0; i < stepfound.tips.length; i++) {
      if (stepfound.tips[i] === id) {
        stepfound.tips.splice(i, 1);
      }
    }
    stepfound.save((err, obj) => {
      TipsModel.findByIdAndRemove(id).exec((err, obj) => {
        if (err) {
          res.json(err);
        }
        if (!obj) {
          res.status(404);
          return next("Nothing to delete");
        } else {
          res.json("Tips deleted");
        }
      });
    });
  });
});

// Route List
router.get("/", isAuthenticated, (req, res) => {
  TipsModel.find({}).exec((err, tips) => {
    res.json(tips);
  });
});

module.exports = router;
