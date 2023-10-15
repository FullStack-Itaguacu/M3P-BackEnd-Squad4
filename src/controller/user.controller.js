const { User } = require('../models/user');
const Address = require('../models/address');
const bcrypt = require('bcrypt');

class UserController {

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
<<<<<<< HEAD

=======
  
>>>>>>> a010438af5e453ab87a8e10e3af59c498e02d2ae
      // Verifica se o e-mail e a senha foram fornecidos
      if (!email || !password) {
        return res.status(401).json({ error: "E-mail e senha são campos obrigatórios." });
      }
<<<<<<< HEAD

=======
  
>>>>>>> a010438af5e453ab87a8e10e3af59c498e02d2ae
      // Busca o usuário no banco de dados pelo e-mail
      const user = await User.findOne({
        where: { email },
      });
<<<<<<< HEAD

=======
  
>>>>>>> a010438af5e453ab87a8e10e3af59c498e02d2ae
      // Verifica se o usuário foi encontrado
      if (!user) {
        return res.status(401).json({ error: "E-mail incorreto." });
      }
<<<<<<< HEAD

=======
  
>>>>>>> a010438af5e453ab87a8e10e3af59c498e02d2ae
      // Verifica se a senha está correta
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Senha incorreta." });
      }
<<<<<<< HEAD

=======
  
>>>>>>> a010438af5e453ab87a8e10e3af59c498e02d2ae
      // Cria um token JWT com os campos solicitados no payload
      const tokenPayload = {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        type_user: user.typeUser,
      };
<<<<<<< HEAD

=======
  
>>>>>>> a010438af5e453ab87a8e10e3af59c498e02d2ae
      const secretKey = process.env.SECRET_KEY_BUYER;

      // Gera um token para o usuário
      const token = jwt.sign(tokenPayload, secretKey);
<<<<<<< HEAD


      // Retorna o token no corpo da resposta
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
  async loginAdminUser(req, res) {
    try {
      const { email, password } = req.body;

      // Verifica se o e-mail e a senha foram fornecidos
      if (!email || !password) {
        return res.status(401).json({ error: "E-mail e senha são campos obrigatórios." });
      }

      // Busca o usuário no banco de dados pelo e-mail
      const user = await User.findOne({
        where: { email },
      });

      // Verifica se o usuário foi encontrado
      if (!user) {
        return res.status(401).json({ error: "E-mail incorreto." });
      }

      // Verifica se a senha está correta
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Senha incorreta." });
      }


      // Cria um token JWT com os campos solicitados no payload
      const tokenPayload = {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        type_user: user.typeUser,
      };
      const secretKey = process.env.SECRET_KEY_ADMIN;

      // Gera um token para o usuário
      const token = jwt.sign(tokenPayload, secretKey);


=======
      
  
>>>>>>> a010438af5e453ab87a8e10e3af59c498e02d2ae
      // Retorna o token no corpo da resposta
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}
module.exports = new UserController();

