const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const bookCtrl = require("../controllers/book");

router.get("/", auth, bookCtrl.getAllBook);
router.post("/", auth, multer.storage, multer.resize, bookCtrl.createBook);
router.put("/:id", auth, multer.storage, multer.resize, bookCtrl.modifyBook); // Ajouté multer.storage et multer.resize
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/:id", auth, bookCtrl.getOneBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
