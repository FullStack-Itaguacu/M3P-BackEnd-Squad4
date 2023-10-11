const { User } = require('../../models/user');

class BuyersAdmin {
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

module.exports = new BuyersAdmin();
