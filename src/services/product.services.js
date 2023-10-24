const { verify } = require("jsonwebtoken");
const { User } = require("../models/user");
const { jwt_secret_key } = require("../config/database.config")


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
      decodedToken = verify(authorization, jwt_secret_key);
    } catch (error) {
      return res.status(401).json({
        message: 'Token inválido',
        cause: error.message,
      }); 
    }
    const user = await User.findByPk(decodedToken.id);
    if(!user || user.typeUser !== 'Administrador') {
      return res.status(403).json({
        message: 'Acesso não autorizado, você não é um administrador',
      });
    }
    return decodedToken;
  }

  // Função para validar o campo typeProduct
  validaProductType(field) {
    const productType = ['Medicamento Controlado', 'Medicamento Não Controlado'];
    if(!productType.includes(field)) {
      return false;
    }
    return true;
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