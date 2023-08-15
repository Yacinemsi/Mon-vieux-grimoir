const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log("Headers:", req.headers);
    const token = req.headers.authorization.split(" ")[1]; // Récupération du token dans le header Authorization de la requête entrante.
    console.log("Token:", token);
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Décodage du token grâce à la fonction verify() de jsonwebtoken. Si celui-ci n'est pas valide, une erreur sera générée.
    console.log("Decoded token:", decodedToken);
    const userId = decodedToken.userId; // Extraction de l'ID utilisateur de notre token

    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    console.log("Problème middleware:", error);
    res.status(401).json({ error: "User not authenticated" });
  }
};
