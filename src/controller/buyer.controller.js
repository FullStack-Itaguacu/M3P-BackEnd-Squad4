const { Address } = require("../models/address");
const { User } = require("../models/user");

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
      if (!req.user || req.user.type !== 'ADMIN') {
        return res.status(403).json({
          msg: 'Acesso negado. Este endpoint só pode ser utilizado por um usuário ADMIN.',
        });
      }

      const { offset, limit } = req.params;
      const { fullName, createdAt } = req.query;

      const parsedOffset = parseInt(offset);
      const parsedLimit = parseInt(limit);

      if (isNaN(parsedOffset) || isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          msg: 'Parâmetros de paginação inválidos',
        });
      }

      const query = {
        type: 'BUYER',
      };

      if (fullName) {
        query.fullName = { $regex: new RegExp(fullName, 'i') };
      }

      const sortOrder = createdAt === 'asc' ? 1 : -1;

      const users = await User.findAll({
        where: query,
        order: [['createdAt', sortOrder]],
        offset: parsedOffset,
        limit: Math.min(parsedLimit, 20),
      });

      if (users.length === 0) {
        return res.status(204).json({
          msg: 'Nenhum usuário encontrado',
        });
      }

      return res.status(200).json({
        count: await User.countDocuments(query),
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
  async listBuyerById(req, res) {
    try {
      // Verifica se o usuário autenticado é um ADMIN
      if (!req.user || req.user.type !== 'ADMIN') {
        return res.status(403).json({
          msg: 'Acesso negado. Este endpoint só pode ser utilizado por um usuário ADMIN.',
        });
      }

      const userId = req.params.userId;

      if (!userId || isNaN(userId) || userId <= 0) {
        return res.status(400).json({
          msg: 'Parâmetro userId inválido',
        });
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          msg: 'Usuário não encontrado',
        });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error in listBuyerById:', error);

      return res.status(500).json({
        error: {
          msg: 'Erro ao processar a requisição',
          details: error.message,
        },
      });
    }
  }

  //admin
  async updateUser(req, res) {
    try {
   
      if (!req.user || req.user.type !== 'ADMIN') {
        return res.status(403).json({
          msg: 'Acesso negado. Este endpoint só pode ser utilizado por um usuário ADMIN.',
        });
      }

      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json({
          msg: 'Parâmetro userId inválido',
        });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          msg: 'Usuário não encontrado',
        });
      }

      const { fullName, email, cpf, phone, typeUser } = req.body;

      if (fullName !== undefined && fullName !== '') {
        user.fullName = fullName;
      }

      if (email !== undefined && email !== '') {
        //verificar a lógica de email???

        user.email = email;
      }

      if (cpf !== undefined && cpf !== '') {
        //remove caracteres especiais do cpf com replace
        user.cpf = cpf.replace(/[^\d]/g, '');
      }

      if (phone !== undefined && phone !== '') {

        const parsedPhone = parseInt(phone);
        if (!isNaN(parsedPhone) && parsedPhone >= 0) {
          user.phone = parsedPhone.toString();
        } else {
          return res.status(422).json({
            msg: 'Campo phone inválido',
          });
        }
      }

      if (typeUser !== undefined && typeUser !== '') {

        if (user.type !== 'ADMIN' || typeUser === 'ADMIN') {
          user.type = typeUser;
        } else {
          return res.status(422).json({
            msg: 'Não é permitido trocar de ADMIN para BUYER',
          });
        }
      }

      await user.save();

      return res.status(204).send();
    } catch (error) {
      console.error('Error in updateUser:', error);

      return res.status(500).json({
        error: {
          msg: 'Erro ao processar a requisição',
          details: error.message,
        },
      });
    }
  }
}

module.exports = new BuyerController();
