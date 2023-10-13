const { User } = require('../models/user');
const {Product} = require('../models/product');
const { 
    validaAuthorizationHeaders, 
    validateField 
} = require('../services/product.services');

class ProductController {
    async createOneProduct(req, res) {
        const { authorization } = req.headers;
        try {
            // Verificar dados passados no headers
            const decodedToken = await validaAuthorizationHeaders(authorization, res);
            
            // Pegar os dados do produto passados no corpo da requisição
            const { product } = req.body;

             // Validação dos campos obrigatórios
             const fieldValidations = [
                validateField('name', product.name),
                validateField('labName', product.labName),
                validateField('imageLink', product.imageLink),
                validateField('dosage', product.dosage),
                validateField('unitPrice', product.unitPrice),
                validateField('typeProduct', product.typeProduct),
                validateField('totalStock', product.totalStock),
            ]

             //Encontrar a primeira validação que falhe
             const firstValidationError = fieldValidations.find(
                validation => validation !== null
            );

            // Se houver uma validação que falhou, retorne um erro
            if (firstValidationError) {
                return res.status(422).json({ 
                    message: firstValidationError.error 
                }); 
            }

            // Valide o campo typeProduct
            const productType = [
                'Medicamento Controlado', 
                'Medicamento Não Controlado'
            ]
            if (!productType.includes(product.typeProduct)) {
                return res.status(400).json({
                    message: 'Campo tipo do produto mal formatado',
                });
            }

            // Criar um produto
            const newProduct = await Product.create({
                name: product.name,
                labName: product.labName,
                imageLink: product.imageLink,
                dosage: product.dosage,
                unitPrice: product.unitPrice,
                typeProduct: product.typeProduct,
                totalStock: product.totalStock,
                userId: decodedToken.id,
            });

            return res.status(201).json({
                message: 'Produto criado com sucesso.',
                data: newProduct,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor.',
                error: error.message,
            });     
        }
    }

    async listAllProductsByUser(req, res) {
        const { authorization } = req.headers;
        const { offset, limit } = req.params;
        const { name, typeProduct, totalStock } = req.query;
        
        try {
            // Verificar dados passados no headers
            const decodedToken = await validaAuthorizationHeaders(authorization, res);

            // Filtrar produtos com base em query params
            const filter = {};
            if(name) {
                filter.name = name;
            }
            if(typeProduct) {
                filter.typeProduct = typeProduct;
            }

            // Ordenar pelo campo totalStock
            const order = [['total_stock', totalStock === 'asc' ? 'ASC' : 'DESC']];

            // Configuração da paginação usando offset e limit
            const valueOffset = parseInt(offset) || 0;
            const valueLimit = parseInt(limit) || 20;

            // Consultar produtos cadastrados pelo administrador com base no seu id
            const productsByUserAdmin = await Product.findAndCountAll({
                where: { user_id: decodedToken.id, ...filter },
                order,
                valueOffset,
                valueLimit,
            })
            if(productsByUserAdmin.count === 0) {
                return res.status(204).json({
                    message: 'Nenhum produto encontrado'
                })
            }

            return res.status(200).json({
                message: 'Produtos listados com sucesso',
                data: productsByUserAdmin,
                totalResults: productsByUserAdmin.count,
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Ocorreu um eroo no servidor',
                error: error.message
            })
        }
    }

    async listAllProducts(req, res) {
        const { authorization } = req.headers;
        const { offset, limit } = req.params;
        const { name, typeProduct, totalStock } = req.query;

        try {
            // Verificar dados passados no headers
            const decodedToken = await validaAuthorizationHeaders(authorization, res);

            // Filtrar produtos com base no query params
            const filter = {};
            if(name) {
                filter.name = name;
            }
            if(typeProduct) {
                filter.typeProduct = typeProduct;
            }

            // Ordenar pelo total do estoque
            const order = [['total_stock', totalStock === 'asc' ? 'ASC' : 'DESC']];

            // Configuração da paginação usando offset e limit
            const valueOffset = parseInt(offset) || 0;
            const valueLimit = parseInt(limit) || 20;

            // Consultar produtos com base no query params
            const allProducts = await Product.findAndCountAll({
                where: filter,
                order,
                valueOffset,
                valueLimit,
            })
            if(allProducts.count === 0) {
                return res.status(204).json({
                    message: 'Nenhum produto encontrado'
                })
            }

            return res.status(200).json({
                message: 'Produtos listados com sucesso',
                data: products,
                totalResults: allProducts.count,
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                error: error.message,
            })    
        }
    }

    async listProductById(req, res) {
        const { authorization } = req.headers;
        const { productId } = req.params;
        
        try {
            // Verificar dados passados no headers
            const decodedToken = await validaAuthorizationHeaders(authorization, res);
            
            // Verificar se o id do produto foi passado por parametro
            if(!productId) {
                return res.status(401).json({
                    message: 'Id do produto não fornecido',
                })
            }

            // Consultar um produto pelo seu código
            const retornedProduct = await Product.findByPk(productId);
            if(!retornedProduct) {
                return res.status(404).json({
                    message: 'Produto não encontrado',
                })
            }

            return res.status(200).json({
                message: 'Produto encontrado com sucesso',
                data: retornedProduct,
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                error: error.message,
            })
        }
    }

    async updateProductById(req, res) {
        const { authorization } = req.headers;
        const { productId } = req.params;
        const { name, imageLink, dosage, totalStock } = req.body;

        try {
            // Verificar dados passados no headers
            const decodedToken = await validaAuthorizationHeaders(authorization, res);

            // Verificar se o pruduto existe
            const retornedProduct =await Product.findByPk(productId);
            if(!retornedProduct) {
                return res.status(400).json({
                    message: 'Produto não encontrado',
                })
            }

            const dataForUpdate = Object.assign(
                {},
                name && { name },
                imageLink && { imageLink },
                dosage && { dosage },
                totalStock && { totalStock },
            )
            await Product.update(dataForUpdate, {where: {productId}});

            return res.status(204).json({
                message: 'Produto alterado com sucesso',
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                error: error.message,
            })
        }
    }
}

module.exports = new ProductController();