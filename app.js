const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const sharp = require("sharp");

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

// Connection à MongoDB
mongoose
  .connect(
    "mongodb+srv://Yacinemsi:6YdXAVaR6SNnAKtB@cluster0.dxxjvso.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  console.log("Request URL:", req.originalUrl);
  next();
});

// Routes pour les livres et les utilisateurs
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

// Route pour redimensionner une image
app.get("/resize-image", async (req, res) => {
  const widthString = req.query.width;
  const heightString = req.query.height;
  const format = req.query.format;

  const width = parseInt(widthString);
  const height = parseInt(heightString);

  // Supposez que vous avez une image appelée "sample.jpg" dans un dossier "images"
  const inputPath = path.join(__dirname, "images", "sample.jpg");
  const outputPath = path.join(
    __dirname,
    "images",
    `output.${format || "jpg"}`
  );

  try {
    const transformer = sharp(inputPath).resize(width, height);

    if (format) {
      transformer.toFile(outputPath, (err, info) => {
        if (err) {
          res
            .status(500)
            .json({ error: "Erreur pendant le traitement de l'image" });
          return;
        }
        res.sendFile(outputPath);
      });
    } else {
      transformer.toFile(outputPath, (err, info) => {
        if (err) {
          res
            .status(500)
            .json({ error: "Erreur pendant le traitement de l'image" });
          return;
        }
        res.sendFile(outputPath);
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du traitement de l'image" });
  }
});

// Route pour servir des images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
