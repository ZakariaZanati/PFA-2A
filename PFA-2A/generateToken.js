const jwt = require('jsonwebtoken');
require('dotenv').config();
 

const generateToken = (res, userId, nom,prenom,email,type) => {
  const token = jwt.sign({ userId, nom,prenom,email,type }, process.env.ACCESS_TOKEN_SECRET);
  return res.cookie('mytoken', token, {
    secure: false, 
    httpOnly: true,
  });
};
module.exports = generateToken