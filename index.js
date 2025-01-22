const express = require('express');
const app = express();


app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
})

// Rota que lança um erro



app.get('/erro', (req, res) => {
    throw new Error('Erro simulado!');
})

app.use((err,req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Algo deu errado no banco de dados')
})

app.get('/', (req, res) => {
    res.send('Servidor Express.js esta rodando')
});
const protegerRota = (req, res, next) => {
    const token = req.headers['authorization'];
    if(token === "token-de-acesso"){
        next()

    }else{
        res.status(403).send('Acesso negado token invalido!')
    }
}
app.get('/rota-protegida', protegerRota, (req, res) => {
    res.send('Voce acessou uma rota protegida')
})

const  logProdutoMiddleware = (req, res, next) => {
    console.log('Produto foi acessado....')
    next()

}

app.get('/produtos', logProdutoMiddleware,  (req, res) => {
    res.send('Lista de Produtos');
});

app.get('/sobre', (req, res) => {
    res.send('Pagina sobre Nos');
})

// http://localhost:3000/adicionar-produto

app.post('/adicionar-produto', (req, res) => {
    const produto = req.body;
    if(!produto.nome || !produto.preco){
        console.log('campos sao necessarios ')
    }
    try{
        res.send(`Produto ${produto.nome} adicionado com sucesso!`)

    } catch(error){
        console.log(error)
    }
})

app.use((req, res) => {
    res.status(404).send('Página não encontrada!')
})


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor esta rodando em http://localhost:${PORT}`)
});