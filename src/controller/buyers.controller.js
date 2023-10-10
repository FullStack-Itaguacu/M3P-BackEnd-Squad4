const { Address } = require('../models/address')

class BuyerAddressController {

    async listUserAddresses(req, res) {
        try {
            // Obtém o ID do usuário do payload do JWT
            const userId = req.user.id;

            // Verifica se o ID do usuário é válido
            if (userId <= 0) {
                return res.status(400).send({
                    msg: "O ID do usuário deve ser um número"
                })
            }

            // Busca os endereços cadastrados para o usuário
            const userAddresses = await Address.findAll({ where: { userId } })

            // Verifica se o usuário tem endereços cadastrados
            if (!userAddresses || userAddresses.length === 0) {
                return res.status(200).send({
                    msg: "O usuário não tem endereços cadastrados"
                })
            }

            // Retorna os endereços cadastrados do usuário
            return res.status(200).send(userAddresses)
        } catch (error) {
            return res.status(401).send({
                msg: "Erro ao processar a requisição",
                error: error.message
            })
        }
    }
}

module.exports = new BuyerAddressController();
