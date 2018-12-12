const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// Importation de Cloudinary
const cloudinary = require("cloudinary");
// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const uid2 = require("uid2");

const uploadPictures = (req, res, next) => {
  console.log("upload pictures");
  // J'initialise un tableau vide pour y stocker mes images uploadées
  const pictures = [];
  // Je récupères le tabelau de fichiers
  const files = req.body.files;
  // J'initialise le nombre d'upload à zéro
  let filesUploaded = 0;
  // Et pour chaque fichier dans le tableau, je crée un upload vers Cloudinary
  if (files && files.length) {
    files.forEach(file => {
      // Je crée un nom spécifique pour le fichier
      const name = uid2(16);
      cloudinary.v2.uploader.upload(
        file,
        {
          // J'assigne un dossier spécifique dans Cloudinary pour chaque utilisateur
          public_id: `tripizy/${req.user._id}/${name}`
        },
        (error, result) => {
          console.log(error, result);
          // Si j'ai une erreur avec l'upload, je sors de ma route
          if (error) {
            return res.status(500).json({ error });
          }
          // Sinon, je push mon image dans le tableau
          pictures.push(result);
          // Et j'incrémente le nombre d'upload
          filesUploaded++;
          console.log("-------\n", result);
          // Si le nombre d'uploads est égal au nombre de fichiers envoyés...
          if (filesUploaded === files.length) {
            /* res
                        .status(200)
                        .json({message: `You've uploaded ${filesUploaded} files.`}); */
            // ... je stocke les images dans l'objet `req`...
            req.pictures = pictures;
            // ... et je poursuis ma route avec `next()`
            next();
          }
        }
      );
    });
  } else {
    // Pas de fichier à uploader ? Je poursuis ma route avec `next()`.
    next();
  }
};

module.exports = uploadPictures;
