const { User } = require('../models/user');
const { Sale } = require('../models/sales');
const { verify } = require("jsonwebtoken");
const { Product } = require('../models/product');
const { connection } = require("../database/connection");


class SaleController {
    async createOneSale(req, res) {
        //#swagger.tags = ['Sale']
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                message: 'Acesso não autorizado. Token não foi fornecido'
            });
        }

        let decodedToken;
        try {
            decodedToken = verify(authorization, process.env.JWT_SECRET_KEY);
        } catch (error) {
            return res.status(401).json({
                message: 'Token inválido',
                cause: error.message,
            });
        }

        try {
            const saleData = req.body;
            for (const saleItem of saleData) {

                const sallerId = await Product.findOne({ where: { id: saleItem.product_id } })

                const newSale = await Sale.create({
                    unitPrice: sallerId.unitPrice,
                    amountBuy: saleItem.amount_buy,
                    total: sallerId.unitPrice * saleItem.amount_buy,
                    typePayment: saleItem.type_payment,
                    buyerId: decodedToken.id,
                    sellerId: sallerId.userId,
                    productId: saleItem.product_id,
                    usersAddressesId: saleItem.users_addresses_id,

                })
                const productUpdate = {
                    userId: sallerId.userId,
                    name: sallerId.name,
                    labName: sallerId.labName,
                    imageLink: sallerId.imageLink,
                    dosage: sallerId.dosage,
                    unitPrice: sallerId.unitPrice,
                    totalStock: sallerId.totalStock - saleItem.amount_buy,
                    typeProduct: sallerId.typeProduct,
                    description: sallerId.description

                }

                const whereCondition = {
                    id: sallerId.id
                };

                await Product.update(productUpdate, { where: whereCondition });

            }
            res.status(201).json({ msg: 'Venda criada com sucesso' });

        } catch (error) {
            console.error('Erro no controller de venda:', error);
            res.status(500).json({
                error: { msg: 'Erro ao processar a requisição', details: error.message }
            });

        }
    }
    async listSale(req, res) {
        //#swagger.tags = ['Sale']
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                message: 'Acesso não autorizado. Token não foi fornecido'
            });
        }

        let decodedToken;
        try {
            decodedToken = verify(authorization, process.env.JWT_SECRET_KEY);
        } catch (error) {
            return res.status(401).json({
                message: 'Token inválido',
                cause: error.message,
            });
        }
        
        try {

            const sales = await Sale.findAll({ where: { buyerId: decodedToken.id } });

            console.log(sales);
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
        //#swagger.tags = ['Sale']
        try {

        } catch (error) {

        }
    }
    async listResultByAdmin(req, res) {
        //#swagger.tags = ['Sale']
        try {

        } catch (error) {

        }
    }

}

module.exports = new SaleController();
