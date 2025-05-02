const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();
const Usuario = require('./models/Usuario')
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors');
const lusca = require('lusca');
const session = require('express-session');
const cookieParser = require("cookie-parser");
app.use(cookieParser());



app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'csrf-token'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(session({
  secret: 'seuSegredoSuperSecreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true se for HTTPS
}));



// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutos
//   max: 100,
//   message: 'Muitas requisições. Tente novamente mais tarde.'
// });



app.use(helmet());
// app.use(limiter);
app.use(express.json());

const SECRET = process.env.JWTtoken

const autenticado = (req, res, next) => {
  const token = req.headers['authorization'];

  if(!token){
    return res.status(401).send({error: 'Acesso negado. token não fornecido.'})
  }

  try{
    const payload = jwt.verify(token, SECRET);
    req.usuario = payload;
    next()

  }catch(error){
    res.stutus(401).json({error: 'Token invalido ou expirado'})
  }
}

const verficarPermissao = (permissao) => {
  return (req, res, next) => {
    if(!permissao.includes(req.usuario.role)){
      return res.status(403).json({erro: 'Acesso negado. Permissão insuficiente.'})
    }
    next()
  }
  
}

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rota que lança um erro

app.get("/erro", (req, res) => {
  throw new Error("Erro simulado!");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Algo deu errado no banco de dados");
});

app.get("/", (req, res) => {
  res.send("Servidor Express.js esta rodando");
});
const protegerRota = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token === "token-de-acesso") {
    next();
  } else {
    res.status(403).send("Acesso negado token invalido!");
  }
};
app.get("/rota-protegida", autenticado, (req, res) => {
  res.json({mesage: `Bem vindo usuario com ID: ${req.usuario.id}`})
});


const logProdutoMiddleware = (req, res, next) => {
  console.log("Produto foi acessado....");
  next();
};

app.get("/produtos", logProdutoMiddleware, (req, res) => {
  res.send("Lista de Produtos");
});

app.get("/sobre", (req, res) => {
  res.send("Pagina sobre Nos");
});

// http://localhost:3000/adicionar-produto

app.post("/adicionar-produto", (req, res) => {
  const produto = req.body;
  if (!produto.nome || !produto.preco) {
    console.log("campos sao necessarios ");
  }
  try {
    res.send(`Produto ${produto.nome} adicionado com sucesso!`);
  } catch (error) {
    console.log(error);
  }
});


app.use((req, res, next) => {
  if (req.path === '/csrf-token') {
    // Aplica CSRF para essa rota específica
    lusca.csrf()(req, res, next);
  } else if (!req.path.startsWith('/api')) {
    // Aplica CSRF para rotas normais
    lusca.csrf()(req, res, next);
  } else {
    // Ignora para rotas /api
    next();
  }
});
// Lusca CSRF Middleware global
app.use(lusca.csrf());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.get('/csrf-token', (req, res) => {
  const token = req.csrfToken();
  res.json({ csrfToken: token });
});

// apenas admin podem acessar
app.get('/admin', autenticado, verficarPermissao(['admin']), (req, res, next) => {
  res.json({ message: 'Bem vindo, admin'})
})

// ambos admin e usuarios pode acessar
app.get('/perfil', autenticado, verficarPermissao(['user', 'admin']), (req, res) => {
  res.json({message: 'bem vindo ao ser perfil' + req.usuario.email})
})


app.use("/api/users",  require('./routes/Users'));
app.use("/api/notas", require('./routes/Notas'));
app.use("/api", require('./routes/uploads'))

app.use((req, res) => {
  res.status(404).send("Página não encontrada!");
});

// Aplica CSRF globalmente, mas só para rotas não-API

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Erro: A variável de ambiente MONGODB_URI não está definida.");
  process.exit(1); // Encerra o processo, pois a conexão com o banco é crítica
}
const options = {
  serverSelectionTimeoutMS: 30000, // 30 segundos
  socketTimeoutMS: 30000, // 30 segundos
};
// Conexão com o banco de dados
mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch((error) => {
    console.error("Erro de conexão com o banco de dados:", error);
  });

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor esta rodando em http://localhost:${PORT}`);
});
