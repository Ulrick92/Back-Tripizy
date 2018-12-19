const Usermodel = require("../models/User.js");

module.exports = (req, res, next) => {
  console.log("Authentification");
  if (req.headers.authorization) {
    Usermodel.findOne({
      token: req.headers.authorization.replace("Bearer ", "")
    })
      .populate("travelbooks")
      .exec((err, user) => {
        if (err) {
          console.log("error");
          console.log(err.message);
          return res.status(400).json({ error: err.message });
        }
        if (!user) {
          console.log("NO user");
          return res.status(401).json({ error: "Unauthorized" });
        } else {
          req.user = user;
          console.log("found", req.user._id);
          return next();
        }
      });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
