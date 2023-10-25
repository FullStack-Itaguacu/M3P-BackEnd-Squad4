// Função para validar e-mails
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Função para validar CPF
  function validateCPF(cpf) {
    const cpfRegex = /^[0-9]{11}$/;
    return cpfRegex.test(cpf);
  }
  
  // Função para validar telefone (phone)
  function validatePhone(phone) {
    const phoneRegex = /^[0-9]+$/;
    return phoneRegex.test(phone) && phone.length >= 8; // Exige pelo menos 8 dígitos
  }
  
  module.exports = { validateEmail, validateCPF, validatePhone };
  