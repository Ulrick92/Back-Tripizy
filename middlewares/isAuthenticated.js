const Usermodel = require("../models/User.js");

module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    Usermodel.findOne({
      token: req.headers.authorization.replace("Bearer ", "")
    })
      .populate("travelbooks")
      .exec((err, user) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        if (!user) {
          return res.status(401).json({ error: "Unauthorized" });
        } else {
          req.user = user;

          return next();
        }
      });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
