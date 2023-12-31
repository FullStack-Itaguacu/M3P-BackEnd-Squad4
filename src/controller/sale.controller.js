const { Sale } = require('../models/sales');
const { verify } = require("jsonwebtoken");
const { Product } = require('../models/product');
const { jwt_secret_key } = require('../config/env');


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
            decodedToken = verify(authorization, jwt_secret_key);
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
            decodedToken = verify(authorization, jwt_secret_key);
        } catch (error) {
            return res.status(401).json({
                message: 'Token inválido',
                cause: error.message,
            });
        }

        try {
            const sales = await Sale.findAll({ where: { buyerId: decodedToken.id } });

            res.status(200).json(sales);

        } catch (error) {
            res.status(500).json({
                error:
                    { msg: 'Erro ao processar a requisição', details: error.message }
            });
        }
    }

    async listSaleByAdmin(req, res) {
        //#swagger.tags = ['Sale']
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                message: 'Acesso não autorizado. Token não foi fornecido'
            });
        }

        let decodedToken;
        try {
            decodedToken = verify(authorization, jwt_secret_key);
        } catch (error) {
            return res.status(401).json({
                message: 'Token inválido',
                cause: error.message,
            });
        }
        console.log(decodedToken.type_user)
        if (decodedToken.type_user !== "Administrador") {
            console.log(decodedToken.type_user)
            return res.status(403).json({
                message: 'Acesso restrito a user type: ADMIN'
            });
        }

        try {

            const sales = await Sale.findAll({ where: { sellerId: decodedToken.id } });
            const results = [];
            for (let i = 0; i < sales.length; i++) {
                const sale = sales[i];
                const product = await Product.findOne({ where: { id: sale.productId } });

                if (product) {
                    const result = {
                        id: sale.id,
                        imageLink: product.imageLink,
                        productName: product.name,
                        amountBuy: sale.amountBuy,
                        unitPrice: sale.unitPrice,
                        total: sale.amountBuy * sale.unitPrice
                    };
                    results.push(result);
                }
            }

            res.status(200).json(results);

        } catch (error) {
            console.error('Erro no controller de venda:', error);
            res.status(500).json({
                error:
                    { msg: 'Erro ao processar a requisição', details: error.message }
            });
        }
    }
    async listResultByAdmin(req, res) {
        //#swagger.tags = ['Sale']
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                message: 'Acesso não autorizado. Token não foi fornecido'
            });
        }

        let decodedToken;
        try {
            decodedToken = verify(authorization, jwt_secret_key);
        } catch (error) {
            return res.status(401).json({
                message: 'Token inválido',
                cause: error.message,
            });
        }

        if (decodedToken.type_user !== "Administrador") {

            return res.status(403).json({
                message: 'Acesso restrito a user type: ADMIN'
            });
        }

        try {

            const sales = await Sale.findAll({ where: { sellerId: decodedToken.id } });
            console.log(sales);
            let totalSales = 0;
            let totalAmount = 0;
            for (const saleItem of sales) {
                totalSales += saleItem.total;
                totalAmount += saleItem.amountBuy;
            }

            const result = {
                totalSales: totalSales,
                totalAmount: totalAmount
            };
            res.status(200).json(result);



        } catch (error) {
            console.error('Erro no controller de venda:', error);
            res.status(500).json({
                error:
                    { msg: 'Erro ao processar a requisição', details: error.message }
            });
        }
    }

}

module.exports = new SaleController();
