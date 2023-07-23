const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récupération du token dans le header Authorization de la requête entrante. On récupère uniquement la partie après l'espace avec split() et on sélectionne le 2ème élément du tableau retourné.
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Décodage du token grâce à la fonction verify() de jsonwebtoken. Si celui-ci n'est pas valide, une erreur sera générée.
    const userId = decodedToken.userId; // Extraction de l'ID utilisateur de notre token
    req.auth = {
      userId: userId,
    };
  } catch (error) {
    res.status(401).json({ error });
  }
};
