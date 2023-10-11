const { Address } = require("../models/address");
const { User } = require("../models/user");

class BuyersController {
  async listUserAddresses(req, res) {
    try {
      // Obtém o ID do usuário do payload do JWT
      const userId = req.user && req.user.id;

      // Verifica se o ID do usuário é válido
      if (!userId || isNaN(userId) || userId <= 0) {
        return res.status(400).send({
          msg: "O ID do usuário deve ser um número válido",
        });
      }

      const userAddresses = await Address.findAll({ where: { userId } });

      if (!userAddresses || userAddresses.length === 0) {
        return res.status(200).send({
          msg: "O usuário não tem endereços cadastrados",
        });
      }

      return res.status(200).send(userAddresses);
    } catch (error) {
      return res.status(401).send({
        msg: "Erro ao processar a requisição",
        error: error.message,
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

      const users = await User.find(query)
        .sort({ createdAt: sortOrder })
        .skip(parsedOffset)
        .limit(Math.min(parsedLimit, 20)); // Limit 20

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

      return res.status(401).json({
        error: {
          msg: 'Erro ao processar a requisição',
          details: error.message,
        },
      });
    }
  }
}

module.exports = new BuyersController();
