const { verify } = require("jsonwebtoken");
const { User } = require("../models/user");


class ProductServices {
  // Validação dos dados passados no headers
  async validaAuthorizationHeaders(authorization, res) {
    if(!authorization) {
      return res.status(401).json({
        message: 'Acesso não autorizado. Token não foi fornecido' 
      });
    }
    let decodedToken;
    try {
      decodedToken = verify(authorization, process.env.SECRET_JWT);
    } catch (error) {
      return res.status(401).json({
        message: 'Token inválido',
        cause: error.message,
      }); 
    }
    const user = await User.findByPk(decodedToken.id);
    if(!user || user.typeUser !== 'ADMIN') {
      return res.status(403).json({
        message: 'Acesso não autorizado, você não é um administrador',
      });
    }
    return decodedToken;
  }
   
  // Função para validar campos obrigatórios
  validateField(fieldName, fieldValue) {
    if (!fieldValue) {
      return { error: `${fieldName} é obrigatório` };
    }
    return null;
  }
}
  
module.exports = new ProductServices();