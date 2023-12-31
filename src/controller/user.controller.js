const { User } = require('../models/user');
const Address = require('../models/address');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { jwt_secret_key } = require('../config/env');
const { throwErrorIf, validatePassword, validatePhone, validateCPF } = require('../services/user.services')

class UserController {

  async loginUser(req, res) {
    //#swagger.tags = ['User']
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

      // Gera um token para o usuário
      const token = sign(tokenPayload, jwt_secret_key, { expiresIn: "1d" });

      // Retorna o token no corpo da resposta
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async loginAdminUser(req, res) {
    //#swagger.tags = ['User']
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

      // Gera um token para o usuário
      const token = sign(tokenPayload, jwt_secret_key, { expiresIn: "1d" });

      // Retorna o token no corpo da resposta
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async buyerSignup(req, res) {
    //#swagger.tags = ['User']
    try {
      const { user, address } = req.body;

      const {
        fullName,
        cpf,
        birthDate,
        email,
        phone,
        password,
      } = user;

      const {
        zip,
        street,
        numberStreet,
        neighborhood,
        city,
        state,
        complement,
        lat,
        long,
      } = address[0];

      // Verifica campos obrigatórios
      throwErrorIf(!fullName, "O campo nome é obrigatório.");
      throwErrorIf(!cpf, "O campo CPF é obrigatório.");
      throwErrorIf(!birthDate, "O campo data de nascimento é obrigatório.");
      throwErrorIf(!email, "O campo email é obrigatório.");
      throwErrorIf(!phone, "O campo telefone é obrigatório.");
      throwErrorIf(!password, "O campo senha é obrigatório.");
      throwErrorIf(!zip, "O campo cep é obrigatório.");
      throwErrorIf(!street, "O campo logradouro é obrigatório.");
      throwErrorIf(!numberStreet, "O campo número é obrigatório.");
      throwErrorIf(!neighborhood, "O campo bairro é obrigatório.");
      throwErrorIf(!city, "O campo cidade é obrigatório.");
      throwErrorIf(!state, "O campo estado é obrigatório.");

      // Validação da senha
      const passwordValidation = validatePassword(user.password);
      if (passwordValidation) {
        return res.status(passwordValidation.status).json({ message: passwordValidation.message });
      }

      // Validação do telefone
      const phoneValidation = validatePhone(user.phone);
      if (phoneValidation) {
        return res.status(phoneValidation.status).json({ message: phoneValidation.message });
      }

      // Validação do CPF
      const cpfValidation = validateCPF(user.cpf);
      if (cpfValidation) {
        return res.status(cpfValidation.status).json({ message: cpfValidation.message });
      }

      // Cria o usuário.
      const hashedPassword = await bcrypt.hash(password, 10); // Criptografe a senha.
      const createdUser = await User.create({
        fullName,
        cpf,
        birthDate,
        email,
        phone,
        password: hashedPassword,
        typeUser: 'Comprador',
      });

      const addresses = await Address.bulkCreate(address);
      const addressesIDs = addresses.map((item)=> item.id);
      await createdUser.setAddresses(addressesIDs);

      return res.status(201).send({ message: "Usuário cadastrado com sucesso." });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        if (error.fields.email || error.fields.cpf) {
          return res.status(409).send({
            message: "Não foi possível cadastrar o usuário.",
            cause: error.message,
          });
        }
      }

      return res.status(400).send({
        message: "Não foi possível cadastrar o usuário.",
        cause: error.message,
      });
    }
  }

  async adminSignup(req, res) {
    //#swagger.tags = ['User']
    try {
      const { user, address } = req.body;

      const {
        fullName,
        cpf,
        birthDate,
        email,
        phone,
        password,
        typeUser,
      } = user;

      const {
        zip,
        street,
        numberStreet,
        neighborhood,
        city,
        state,
        complement,
        lat,
        long,
      } = address[0];

      // Verifica campos obrigatórios
      throwErrorIf(!fullName, "O campo nome é obrigatório.");
      throwErrorIf(!cpf, "O campo CPF é obrigatório.");
      throwErrorIf(!birthDate, "O campo data de nascimento é obrigatório.");
      throwErrorIf(!email, "O campo email é obrigatório.");
      throwErrorIf(!phone, "O campo telefone é obrigatório.");
      throwErrorIf(!password, "O campo senha é obrigatório.");
      throwErrorIf(!zip, "O campo cep é obrigatório.");
      throwErrorIf(!street, "O campo logradouro é obrigatório.");
      throwErrorIf(!numberStreet, "O campo número é obrigatório.");
      throwErrorIf(!neighborhood, "O campo bairro é obrigatório.");
      throwErrorIf(!city, "O campo cidade é obrigatório.");
      throwErrorIf(!state, "O campo estado é obrigatório.");
      throwErrorIf(!typeUser, "O campo tipo de usuário é obrigatório.");

      // Validação da senha
      const passwordValidation = validatePassword(user.password);
      if (passwordValidation) {
        return res.status(passwordValidation.status).json({ message: passwordValidation.message });
      }

      // Validação do telefone
      const phoneValidation = validatePhone(user.phone);
      if (phoneValidation) {
        return res.status(phoneValidation.status).json({ message: phoneValidation.message });
      }

      // Validação do CPF
      const cpfValidation = validateCPF(user.cpf);
      if (cpfValidation) {
        return res.status(cpfValidation.status).json({ message: cpfValidation.message });
      }

      // Cria o usuário.
      const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha.
      const createdUser = await User.create({
        fullName,
        cpf,
        birthDate,
        email,
        phone,
        password: hashedPassword,
        typeUser,
      });

      const addresses = await Address.bulkCreate(address);
      const addressesIDs = addresses.map((item)=> item.id);
      await createdUser.setAddresses(addressesIDs);

      return res.status(201).send({ message: "Usuário cadastrado com sucesso." });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        if (error.fields.email || error.fields.cpf) {
          return res.status(409).send({
            message: "Não foi possível cadastrar o usuário.",
            cause: error.message,
          });
        }
      }
      return res.status(422).send({
        message: "Não foi possível cadastrar o usuário.",
        cause: error.message,
      });
    }
  }
}

module.exports = new UserController();
