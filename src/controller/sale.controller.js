const { User } = require('../models/user');
const { Sale } = require('../models/sales');
const { Product } = require('../models/product');


class SaleController {
    async createOneSale(req, res) {
        try {
            const saleData = req.body;
            // Itere sobre cada objeto no vetor
            for (const saleItem of saleData) {
                const currentDateTime = new Date();
                const newSale = Sale.build({
                    unitPrice: 1.80,
                    amountBuy: saleItem.amount_buy,
                    total: 1.00,
                    typePayment: saleItem.type_payment,
                    buyerId: 2,
                    sellerId: 1,
                    productId: saleItem.product_id,
                    usersAddressesId: saleItem.users_addresses_id,
                    created_at: currentDateTime,
                    update_at: currentDateTime

                })
                console.log(newSale);
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
                      
            const sales = await Sale.findAll();
            //console.log(sales);
            res.status(200).json(sales);

        } catch (error) {
            console.error('Erro no controller de venda:', error);
            res.status(500).json({
                error:
                    { msg: 'Erro ao processar a requisição', details: error.message }
            });
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
