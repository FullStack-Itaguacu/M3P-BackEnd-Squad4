const { Address } = require("../models/address");
const { User } = require("../models/user");
const { validateEmail, validateCPF, validatePhone } = require('../services/buyer.services');

class BuyerController {
  async listUserAddresses(req, res) {
    try {

      const users = await User.findAll({
        include: 'addresses', 
      });
  
      // Extract addresses from all users
      const allAddresses = users.reduce((addresses, user) => {
        if (user.addresses && user.addresses.length > 0) {
          addresses.push(...user.addresses.map(address => ({
            id: address.id,
            zip: address.zip,
            street: address.street,
            numberStreet: address.numberStreet, 
            city: address.city,
            state: address.state,
            complement: address.complement,
            lat: address.lat,
            long: address.long,
          })));
        }
        return addresses;
      }, []);
  
      return res.status(200).json(allAddresses);
    } catch (error) {
      console.error('Error in listUserAddresses:', error);
  
      return res.status(400).json({
        error: {
          msg: 'Error processing the request',
          details: error.message,
        },
      });
    }
  }
  
  //admin
  async listAllBuyers(req, res) {
    try {
      const { offset, limit } = req.params;
      const { fullName, createdAt } = req.query;
  
      const parsedOffset = parseInt(offset);
      const parsedLimit = parseInt(limit);
  
      if (isNaN(parsedOffset) || isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          msg: 'Parâmetros de paginação inválidos',
        });
      }
  //encontrar todos compradores
      const query = {
        typeUser: 'Comprador',
      };
  
      if (fullName) {
        query.fullName = { $regex: new RegExp(fullName, 'i') };
      }
  
      const sortOrder = createdAt === 'asc' ? 'ASC' : 'DESC';
  
      const users = await User.findAll({
        where: query,
        order: [['createdAt', sortOrder]],
        offset: parsedOffset,
        limit: Math.min(parsedLimit, 20),
      });
  
      const count = await User.count({ where: query }); 
      if (users.length === 0) {
        return res.status(204).json({
          msg: 'Nenhum usuário encontrado',
        });
      }
  
      return res.status(200).json({
        count,
        users,
      });
    } catch (error) {
      console.error('Error in listAllBuyers:', error);
  
      return res.status(500).json({
        error: {
          msg: 'Erro ao processar a requisição',
          details: error.message,
        },
      });
    }
  }
  
  //admin
  async getUserById(req, res) {
    try {
      const userId = req.params.userId;
  
      // Verifica se o userId é um número válido
      if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          msg: 'ID do usuário inválido',
        });
      }
  
      // Busca o usuário pelo ID
      const user = await User.findByPk(userId);
  
      // Verifica se o usuário foi encontrado
      if (!user) {
        return res.status(404).json({
          msg: 'Usuário não encontrado',
        });
      }
  
      // Retorna os detalhes do usuário
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error in getUserById:', error);
  
      return res.status(500).json({
        error: {
          msg: 'Erro ao processar a requisição',
          details: error.message,
        },
      });
    }
  };
  
  //admin
  async updateBuyer(req, res) {
    try {
        const userId = req.params.userId;
        const { fullName, email, cpf, phone, typeUser } = req.body;

        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({
                msg: 'ID do usuário inválido',
            });
        }

        const user = await User.findByPk(userId);

        if (!user || user.typeUser !== 'Comprador') {
            return res.status(404).json({
                msg: 'Usuário comprador não encontrado',
            });
        }

        if (fullName != null && typeof fullName !== 'string') {
            return res.status(422).json({
                msg: 'Campo fullName deve ser uma string',
            });
        }

        if (email != null && !validateEmail(email)) {
            return res.status(422).json({
                msg: 'Email inválido',
            });
        }

        if (cpf != null && !validateCPF(cpf)) {
            return res.status(422).json({
                msg: 'CPF inválido',
            });
        }

        if (phone != null && !validatePhone(phone)) {
            return res.status(422).json({
                msg: 'Campo phone deve ser um número positivo',
            });
        }

        if (typeUser != null && typeUser !== 'Comprador') {
            return res.status(422).json({
                msg: 'A troca de tipo de usuário só é permitida para "Comprador"',
            });
        }

        if (fullName != null) user.fullName = fullName;
        if (email != null) user.email = email;
        if (cpf != null) user.cpf = cpf;
        if (phone != null) user.phone = phone;
        if (typeUser != null) user.typeUser = typeUser;

        await user.save();

        return res.status(204).send();
    } catch (error) {
        console.error('Error in updateBuyer:', error);

        // Trate erros específicos aqui, se possível
        return res.status(500).json({
            error: {
                msg: 'Erro ao processar a requisição',
                details: error.message,
            },
        });
    }
};

}

module.exports = new BuyerController();
