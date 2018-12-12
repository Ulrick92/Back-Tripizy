/*
Le package `dotenv` permet de definir des variables d'environnement
dans le fichier `.env`. Nous utilisons le fichier `.slugignore` pour ignorer
le fichier `.env` dans l'environnement Heroku
*/
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

/*
Le package `helmet` est une collection de protections contre certaines
vulnérabilités HTTP
*/
const helmet = require("helmet");
app.use(helmet());

/*
Les réponses (> 1024 bytes) du serveur seront compressées au format GZIP pour
diminuer la quantité d'informations transmises
*/
var compression = require("compression");
app.use(compression());

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useCreateIndex: true }
);

const port = 3000;
app.use(bodyParser.json({ limit: "150mb" })); // L'upload est fixée à 50mb maximum (pour l'envoi de fichiers)

/*
`Cross-Origin Resource Sharing` est un mechanisme permettant d'autoriser les
requêtes provenant d'un nom de domaine différent. Ici, nous autorisons l'API
à repondre aux requêtes AJAX venant d'autres serveurs.
*/
var cors = require("cors");
app.use("/api", cors());

//  Initialisation des Models
const UserModel = require("./models/User");
const TravelBookModel = require("./models/TravelBook");
const StepModel = require("./models/Step");
const TipsModel = require("./models/Tips");

// Routes
const userRoutes = require("./routes/user");
const travelRoutes = require("./routes/travelbook");
const StepRoutes = require("./routes/step");
const TipsRoutes = require("./routes/tips");

app.use("/user", userRoutes);
app.use("/travelbook", travelRoutes);
app.use("/step", StepRoutes);
app.use("/tips", TipsRoutes);

app.get("/", (req, res) => res.send("Welcome to the API TRIPIZY"));

/*
Toutes les méthodes HTTP (GET, POST, etc.) des pages non trouvées afficheront
une erreur 404
*/
app.all("*", function(req, res) {
  res.status(404).json({ error: "Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Start");
});
