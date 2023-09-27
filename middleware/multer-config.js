const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

// Configuration du stockage des fichiers avec Multer
const diskStorage = multer.diskStorage({
  // Répertoire de destination des fichiers
  destination: "images/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000000);
    const fileName = `${uniqueSuffix}.webp`;
    cb(null, fileName);
  },
});

const storage = multer({ storage: diskStorage }).single("image");

// ... [rest of your code]

// Redimensionner l'image
const resize = (req, res, next) => {
  if (!req.file) {
    console.log("Aucun fichier trouvé.");
    return next();
  }

  // Chemin du fichier d'origine
  const imagePath = req.file.path;

  // Nouveau chemin pour l'image redimensionnée
  const tempResizedPath = `images/resized-${Date.now()}-${Math.round(
    Math.random() * 1000000
  )}.webp`;

  sharp(imagePath)
    .resize(210, 300)
    .toFormat("webp")
    .toFile(tempResizedPath, (error, info) => {
      if (error) {
        console.log("Erreur lors du redimensionnement de l'image:", error);
        return res.status(500).json({ error });
      } else {
        // Supprimer l'original et renommer le redimensionné
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(
              "Erreur lors de la suppression de l'image originale:",
              err
            );
            return res.status(500).json({ err });
          }

          fs.rename(tempResizedPath, imagePath, (err) => {
            if (err) {
              console.log("Erreur lors du renommage de l'image:", err);
              return res.status(500).json({ err });
            }

            console.log("Image redimensionnée avec succès:", info);
            next();
          });
        });
      }
    });
};

// ... [rest of your code]

module.exports = { storage, resize };
