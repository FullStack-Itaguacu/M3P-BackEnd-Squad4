const { User } = require('../models/user');
const Address = require('../models/address');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

class UserController {

    async loginUser(req, res) {
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

            const secretKey = process.env.SECRET_KEY_BUYER;

            // Gera um token para o usuário
            const token = jwt.sign(tokenPayload, secretKey);


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

            // Verifique se o e-mail e a senha foram fornecidos
            if (!email || !password) {
                return res.status(401).json({ error: "E-mail e senha são campos obrigatórios." });
            }

            // Busque o usuário no banco de dados pelo e-mail
            const user = await User.findOne({
                where: { email },
            });

            // Verifique se o usuário foi encontrado
            if (!user) {
                return res.status(401).json({ error: "E-mail incorreto." });
            }

            // Verifique se a senha está correta
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: "Senha incorreta." });
            }


            // Crie um token JWT com os campos solicitados no payload
            const tokenPayload = {
                id: user.id,
                email: user.email,
                full_name: user.fullName,
                type_user: user.typeUser,
            };
            const secretKey = process.env.SECRET_KEY_ADMIN;

            // Gere um token para o usuário
            const token = jwt.sign(tokenPayload, secretKey);


            // Retorne o token no corpo da resposta
            res.status(200).json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro interno do servidor." });
        }
    }
    async buyerSignup(req, res) {
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
          } = address;
    
          // Verifica campos obrigatórios
          if ([
            fullName, cpf, birthDate, email, phone, password, zip, street,
            numberStreet, neighborhood, city, state
          ].some(field => !field)) {
            return res.status(422).json({ message: 'Campos obrigatórios não preenchidos.' });
          }
    
          // Valida Telefone
          if (!/^\d{9,15}$/.test(phone)) {
            return res.status(400).json({ message: 'Telefone inválido.' });
          }
    
          // Cria o endereço.
          const createdAddress = await Address.create({
            zip,
            street,
            numberStreet,
            neighborhood,
            city,
            state,
            complement,
            lat,
            long,
          });
    
          // Cria o usuário.
          const hashedPassword = await bcrypt.hash(password, 10); // Criptografe a senha.
          const createdUser = await User.create({
            fullName,
            cpf,
            birthDate,
            email,
            phone,
            password: hashedPassword,
            addressId: createdAddress.id,
            typeUser: 'Comprador',
          });
    
          return res.status(201).json({ message: 'Registros criados com sucesso.' });
        } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'CPF ou email já cadastrados.' });
          }
          console.error(error);
          return res.status(400).json({ message: 'Erro ao criar registros.' });
        }
      }
      async adminSignup(req, res) {
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
          } = address;
    
          // Verifica campos obrigatórios
          if ([
            fullName, cpf, birthDate, email, phone, password, typeUser, zip, street,
            numberStreet, neighborhood, city, state
          ].some(field => !field)) {
            return res.status(422).json({ message: 'Campos obrigatórios não preenchidos.' });
          }
    
          // Valida Telefone
          if (!/^\d{9,15}$/.test(phone)) {
            return res.status(400).json({ message: 'Telefone inválido.' });
          }
    
          // Verifica se já existe um usuário com o mesmo CPF ou e-mail
          const existingUser = await User.findOne({
            where: {
              [Op.or]: [
                { cpf: user.cpf },
                { email: user.email }
              ]
            }
          });
    
          if (existingUser) {
            return res.status(409).json({ message: "Usuário com CPF ou e-mail já cadastrado." });
          }
    
          // Cria o endereço.
          const createdAddress = await Address.create({
            zip,
            street,
            numberStreet,
            neighborhood,
            city,
            state,
            complement,
            lat,
            long,
          });
    
          // Cria o usuário.
          const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha.
          const createdUser = await User.create({
            fullName,
            cpf,
            birthDate,
            email,
            phone,
            password: hashedPassword,
            addressId: createdAddress.id,
            typeUser: 'Administrador',
          });
    
    
          return res.status(201).json({ message: 'Registros criados com sucesso.' });
        } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'CPF ou email já cadastrados.' });
          }
          console.error(error);
          return res.status(400).json({ message: 'Erro ao criar registros.' });
        }
      }
}
module.exports = new UserController();

