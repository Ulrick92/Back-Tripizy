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
    web_site
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
  TipsModel.find({
    title
  }).exec(function(err, tips) {
    if (tips.length > 0) {
      res.status(400).json({
        error: {
          message: "Ce tips n'existe déjà"
        }
      });
    } else {
      newTips.save(function(err, new_tips) {
        StepModel.tips.push(new_tips._id);
        StepModel.save();
        res.json({
          new_tips
        });
      });
    }
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
        // res.redirect("/:id");
        res.json(updatedTips);
      }
    }
  );
});

// Route Delete
router.delete("/delete/:id", isAuthenticated, (req, res) => {
  const { id } = req.params;
  TipsModel.findByIdAndRemove(
    { _id: ObjsectId(id), step_id: StepModel },
    function(err, obj) {
      if (err) {
        res.json(err);
      }
      if (!obj) {
        res.status(404);
        return next("Nothing to delete");
      } else {
        res.json("Tips deleted");
      }
    }
  );
});

// Route List
router.get("/", isAuthenticated, (req, res) => {
  TipsModel.find({}).exec((err, tips) => {
    res.json(tips);
  });
});

module.exports = router;
