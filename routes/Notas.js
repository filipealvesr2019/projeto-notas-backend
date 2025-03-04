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
  AuthMiddleware, // Middleware de autenticação para verificar o usuário
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
      const novaNota = new Notas({
        titulo,
        conteudo,
        userID: req.user.id, // Salva o ID do usuário autenticado
      });
      await novaNota.save();
      res.status(201).json({ message: "Nota criada com sucesso!", nota: novaNota });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao salvar a nota." });
    }
  }
);

// buscar notas
router.get('/', AuthMiddleware, async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }
    
    try {
        const notas = await Notas.find({ userID: req.user.id });
        res.json(notas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro ao buscar as notas." });
    }
});

module.exports = router;
