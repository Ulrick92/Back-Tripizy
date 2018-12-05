const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/project",
  { useNewUrlParser: true }
);
const app = express();
const port = 3000;
app.use(bodyParser.json());

//  Initialisation des Models
const UserModel = require("./models/User");
// const TravelBookModel = require("./models/TravelBook");
// const StepModel = require("./models/Step");
// const TipsModel = require("./models/Tips");

// Routes
const userRoutes = require("./routes/user");

app.use("/user", userRoutes);

app.all("*", function(req, res) {
  res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
  console.log("Server Start");
});
