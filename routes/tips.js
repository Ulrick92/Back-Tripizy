const router = require("express").Router();
const TipsModel = require("../models/Tips");
const StepModel = require("../models/Step");
const isAuthenticated = require("../middlewares/isAuthenticated");
const uploadPictures = require("../middlewares/uploadPictures");
const ObjsectId = require("mongoose").Types.ObjectId;

// Route Create
router.post("/publish", isAuthenticated, uploadPictures, (req, res) => {
  console.log("tips publish");
  console.log(req.body);
  const {
    category,
    company_name,
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
    company_name,
    price,
    adress,
    city,
    start_date,
    end_date,
    photos: [req.pictures[0].secure_url],
    videos,
    description,
    tel,
    email,
    rate,
    web_site,
    step_id
  });
  StepModel.findById(step_id)
    .populate("tips")
    .exec((err, stepfound) => {
      if (err) {
        console.log("err : ", err.message);
        return res.status(400).json({ error: err.message });
      }
      if (!stepfound) return res.status(400).json({ error: "step not found" });
      for (let i = 0; i < stepfound.tips.length; i++) {
        if (stepfound.tips[i].company_name === company_name) {
          return res.status(400).json({
            error: "Ce tips a déjà été ajouté."
          });
        }
      }
      newTips.save(function(err, tips) {
        if (err) {
          console.log("error", err);
          res.status(400).json({
            message: "An error occurred"
          });
        } else {
          stepfound.tips.push(tips._id);
          stepfound.save(err => {
            if (err) {
              console.log("error", err);
              res.status(400).json({
                message: "An error occurred"
              });
            } else {
              res.json({
                message: "Le tips a bien été ajouté."
              });
            }
          });
        }
      });
    });
});

// Route Read
router.get("/:id", isAuthenticated, (req, res) => {
  console.log("service tips id : ", req.params.id);
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
router.post("/edit/:id", isAuthenticated, uploadPictures, (req, res) => {
  const { id } = req.params;
  const {
    category,
    company_name,
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
        company_name,
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
      TipsModel.findOneAndDelete(id).exec((err, obj) => {
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
  const filter = {};
  if (req.query.city) {
    filter.city = { $regex: req.query.city, $options: "i" };
  }
  if (req.query.company_name) {
    filter.company_name = { $regex: req.query.company_name, $options: "i" };
  }
  if (req.query.category) {
    filter.category = { $regex: req.query.category, $options: "i" };
  }
  TipsModel.find(filter).exec((err, tips) => {
    res.json(tips);
  });
});

module.exports = router;
