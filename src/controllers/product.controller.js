const { User } = require('../models/user');
const { validateField } = require('../utils/validateField');
const {Product} = require('../models/product');
const { verify } = require('jsonwebtoken');

class ProductController {
    async createOneProduct(req, res) {
        const { authorization } = req.headers;
        try {
            // Verificar se o token de autorização vei no header
            if(!authorization) {
                return res.staus(401).json({
                    message: 'Acesso não autorizado.Token não fornecido'        
                });
            }

            // Verificar se o token é válido e decodificar o payload
            let decodedToken;
            try {
                decodedToken = verify(authorization, process.env.SECRET_JWT);
            } catch (error){
                return res.status(401).json({ 
                    message: 'Token inválido',
                    cause: error.message
                });
            }
            
            // Verificar se o usuário é um administrador
            const user = await User.findByPk(decodedToken.id);
            if(!user || user.typeUser !== 'Administrador') {
                return res.status(403).json({
                    message: 'Acesso não autorizado, você não é um administrador'
                })   
            }

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
            // Verificar se o token foi fornecido no headers
            if(!authorization) {
                return res.status(401).json({
                    message: 'Acesso não autorizado. Token não informado'
                })
            }

            //Verificar se o token é válido e decodificar o payload
            let = decodedToken;
            try {
                decodedToken = verify(authorization, process.env.SECRET_JWT);
            } catch (error) {
                return res.status(401).json({
                    message: 'Token inválido',
                    cause: error.message
                })
            }

            // Verificar se o usuário é um administrador
            const user = await User.findByPk(decodedToken.id);
            if(!user || user.typeProduct !== 'Administrador') {
                return res.status(403).json({
                    message: 'Acesso não autorizado. Somente administradores podem cadastrar produtos',
                })
            }

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
            // Verificar se o token de autorização foi fornecido no headers
            if(!authorization) {
                return res.status(401).json({
                    message: 'Acesso não autorizado. Token não fornecido'
                })
            }

            // Verificar se o token é válido e decodificar o payload
            let decodedToken;
            try {
                decodedToken = verify(authorization, process.env.SECRET_JWT);
            } catch (error) {
                return res.status(401).json({
                    message: 'Token inválido',
                    cause: error.message,
                })    
            }

            //Verificar se o usuário é um administrador
            const user = await User.findByPk(decodedToken.id);
            if(!user || user.typeProduct !== 'Administrador') {
                return res.status(403).json({
                    message: 'Acesso não autorizado. Você não é um administrador'
                })
            }

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

}

module.exports = new ProductController();