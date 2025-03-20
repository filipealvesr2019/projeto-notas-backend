const express = require("express");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const lusca = require('lusca');
const rateLimitMiddleware = require("../middleware/rateLimitMiddleware");

const tokenSecret =  process.env.JWT_SECRET
// rota de registro de usuario
router.post(
  "/register",
    // lusca.csrf(),
    rateLimitMiddleware,
  [
    body("nome").trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("senha").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { nome, email, senha } = req.body;

    try {
      const hashedSenha = await bcrypt.hash(senha, 10);  // Corrigido aqui
      const novoUsuario = new User({ nome, email, senha: hashedSenha });
      await novoUsuario.save();

      res.status(200).json({ message: "Usuario registrado com sucesso!" });
    } catch (error) {
      console.log(error);
    }
  }
);
// rota de login
router.post(`/login`,rateLimitMiddleware,  async (req, res) => {
  const { email, senha } = req.body;

  try {
    // procura o usuario no banco de dados
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario não encontrado!" });
    }

    // comparar com senhas
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "senha invalida" });
    }

    // cria token
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, role: usuario.role },
      tokenSecret,
      { expiresIn: "1h" }
    );
    res.json({ message: "Login bem sucedido", token });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
