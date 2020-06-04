const jwt = require('jsonwebtoken');
require('dotenv').config();

async function authenticateToken(req,res,next){

    const token = req.cookies.token || '';

    try {
        if (!token) {
            return res.status(401).json('You need to Login');
        }
        const decrypt = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userInfos = {
            userId: decrypt.userId,
            nom: decrypt.nom,
            prenom: decrypt.prenom,
            email: decrypt.email,
            type: decrypt.type
        };
        next();
    } catch (err) {
        return res.status(500).json(err.toString());
    }
    
}

module.exports = authenticateToken;