const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Autorization');
    if(!token) return res.status(401).json({error: 'acesso negado!'});
    
    try{
        const decoded = jwt.verify(token. process.env.JWTtoken);
        req.user = decoded;
        next();
    }catch(error){
        res.status(400).json({ error: 'token invalido'})
    }
}