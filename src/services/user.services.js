const validatePassword = (password) => {
    if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}/.test(password)) {
      return {
        status: 400,
        message: 'A senha deve ter no mínimo 8 caracteres, sendo pelo menos 1 letra maiúscula, 1 número e 1 caractere especial.',
      };
    }
    return null;
  };
  
  const validatePhone = (phone) => {
    if (!/^\d{9,15}$/.test(phone)) {
      return {
        status: 400,
        message: 'Campo telefone não deve conter caracteres especiais.',
      };
    }
    return null;
  };
  
  const validateCPF = (cpf) => {
    if (!/^\d{11}$/.test(cpf)) {
      return {
        status: 400,
        message: 'Campo CPF não deve conter caracteres especiais e deve conter 11 dígitos numéricos.',
      };
    }
    return null;
  };
 
function throwErrorIf(condition, message) {
    if (condition) throw new Error(message);
  }

  
  module.exports = {
    throwErrorIf,
    validatePassword,
    validatePhone,
    validateCPF
  };