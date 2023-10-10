// Função para validar campos obrigatórios
function validateField(fieldName, fieldValue) {
    if (!fieldValue) {
      return { error: `${fieldName} é obrigatório` };
    }
    return null;
  }
  
  module.exports = {validateField};