const { User } = require('../models/user');
const { Sale } = require('../models/sales');
const { Product } = require('../models/product');


class SaleController {
    async createOneSale(req, res) {
        try {
            const saleData = req.body;
            // Itere sobre cada objeto no vetor
            for (const saleItem of saleData) {

                const newSale = Sale.build({
                    product_id: saleItem.product_id,
                    amount_buy: saleItem.amount_buy,
                    users_addresses_id: saleItem.users_addresses_id,
                    type_payment: saleItem.type_payment,
                    unit_price: 1.00,
                })

                await newSale.save();
               
            }

            res.status(201).json({ msg: 'Venda criada com sucesso' });


        } catch (error) {

            console.error('Erro no controller de venda:', error);
            res.status(500).json({
                error:
                    { msg: 'Erro ao processar a requisição', details: error.message }
            });

        }
    }
    async listSale(req, res) {
        try {
            console.log("cheguei no listSale")
        } catch (error) {

        }
    }

    async listSaleByAdmin(req, res) {
        try {

        } catch (error) {

        }
    }
    async listResultByAdmin(req, res) {
        try {

        } catch (error) {

        }
    }

}

module.exports = new SaleController();
