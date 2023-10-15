// const jwt = require('jsonwebtoken');
// const { config } = require('dotenv');
// config();

// async function authMiddleware(request, response, next) {
//   const token = request.header('Authorization');
//   const typeUser = request.header('User-Type'); // Supondo que você tenha um cabeçalho "User-Type" na solicitação

//   let secretKey;

//   if (typeUser === 'ADMIN') {
//     secretKey = process.env.SECRET_KEY_ADMIN;
//   } else {
//     secretKey = process.env.SECRET_KEY_BUYER;
//   }

//   if (!token) {
//     return response.status(401).json({ message: 'Acesso não autorizado. Token não fornecido.' });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);
//     request.user = decoded.user;
//     next();
//   } catch (err) {
//     return response.status(403).json({ message: 'Acesso não autorizado. Permissão insuficiente.' });
//   }
// }

// module.exports = authMiddleware;