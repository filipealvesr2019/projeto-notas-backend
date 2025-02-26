const express = require("express");
const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const Notas = require("../models/Notas");
const router = express.Router();
const lusca = require('lusca');

// criar nota
router.post(
  "/",
 

  [
    body("titulo").trim().escape(),
    body("conteudo").customSanitizer((value) => sanitizeHtml(value)),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { titulo, conteudo } = req.body;
    try {
      const novaNota = new Notas({ titulo, conteudo, userID: req.user.id });
      await novaNota.save();
    } catch (error) {
      console.log(error);
    }
  }
);

router.get('/', AuthMiddleware, lusca.csrf(),  async (req, res) => {
    const notas = await Notas.find({ userID: req.user.id});
    res.json(notas)
})

module.exports = router