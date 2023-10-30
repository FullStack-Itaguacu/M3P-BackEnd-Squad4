const {Product} = require('../models/product');
const { 
    validaAuthorizationHeaders, 
    validateField, 
    validaProductType
} = require('../services/product.services');

class ProductController {
    async createOneProduct(req, res) {
        //#swagger.tags = ['Product']
        const { authorization } = req.headers;
        try {
            // Verificar dados passados no headers
            const decodedToken = await validaAuthorizationHeaders(authorization, res);
            // Pegar os dados do produto passados no corpo da requisição
            const { name, labName, imageLink, dosage, unitPrice, typeProduct, totalStock } = req.body;

            // Validação dos campos obrigatórios
            const fieldValidations = [
                validateField('name', name),
                validateField('labName', labName),
                validateField('imageLink', imageLink),
                validateField('dosage', dosage),
                validateField('unitPrice', unitPrice),
                validateField('typeProduct', typeProduct),
                validateField('totalStock', totalStock),
            ]

            //Encontrar a primeira validação que falhou
            const firstValidationError = fieldValidations.find(
                validation => validation !== null
            );

            // Se alguma validação falhou, retorna o erro
            if (firstValidationError) {
                return res.status(422).json({ 
                    message: firstValidationError.error 
                }); 
            }

            // Verificar se o campo totalStock é um valor numérico
            if (isNaN(Number(totalStock)) || totalStock < 0) {
                return response.status(400).send({
                    message: "O campo totalStock deve possuir um valor numérico válido!" 
                });
            }

            // Verificar se o produto já foi cadastrado
            const returnedProduct = await Product.findOne({
                where: {name: name, labName: labName}
            });
            if (returnedProduct) {
                const newTotalStock = 0;
                newTotalStock = returnedProduct.totalStock + totalStock;
                await Product.update({ totalStock: newTotalStock });
            
                return res.status(200).json({
                    message: 'Produto já cadastrado, totalStock atualizado'
                });
            }
            
            // Validar o campo dosage
            const campoDosage = ['mg', 'g', 'mL', '%', 'Outro']
            if (!campoDosage.includes(dosage)) {
                return res.status(400).json({
                    message: 'Campo dosage mal formatado',
                    cause: 'O campo deve ter o valor: "mg", "g", "mL", "%" ou "Outro"'
                });
            }

            // Validar o campo unitPrice
            if (isNaN(Number(unitPrice)) || unitPrice < 0) {
                return response.status(400).send({ 
                    message: "O preço unitário deve possuir um valor numérico válido!" 
                });
            }

            // Validar o campo typeProduct
            const productTypeOk = validaProductType(typeProduct)
            if(!productTypeOk) {
                return res.status(400).json({
                    message: 'Campo tipo do produto mal formatado',
                    cause: 'O campo de ter o valor: "Medicamento Controlado" ou "Medicamento Não Controlado"'
                });
            }

            // Criar um produto
            const newProduct = await Product.create({
                name: name,
                labName: labName,
                imageLink: imageLink,
                dosage: dosage,
                unitPrice: unitPrice,
                typeProduct: typeProduct,
                totalStock: totalStock,
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
                cause: error.message,
            });     
        }
    }

    async listAllProductsByUser(req, res) {
        //#swagger.tags = ['Product']
        const { authorization } = req.headers;
        const { offset, limit } = req.params;
        const { name, typeProduct, totalStock } = req.query;
        
        try {
            // Verificar dados passados no headers
            const decodedToken = await validaAuthorizationHeaders(authorization, res);

            let productsByUserAdmin = "";
            
            // Verificar se o campo totalStock é um valor numérico
            if (isNaN(Number(totalStock)) || totalStock < 0) {
                return res.status(400).send({
                    message: "O campo totalStock deve possuir um valor numérico válido!" 
                });
            }
            
             // Ordenar pelo campo totalStock
             const order = [['total_stock', totalStock === 'asc' ? 'ASC' : 'DESC']];

             // Validar os campos offset e limit
             const valueOffset = parseInt(offset);
             const valueLimit = parseInt(limit);
             if (isNaN(offset) || isNaN(limit) || limit <= 0 || limit > 20) {
                 return res.status(400).json({
                     message: 'Parâmetros de paginação inválidos',
                     cause: error.message
                 });
             }
            
            // Filtrar produtos com base em query params
            const filter = {};
            if(name) {
                filter.name = name;
                productsByUserAdmin = await Product.findAndCountAll({
                    where: { user_id: decodedToken.id, ...filter },
                    order,
                    valueOffset,
                    valueLimit,
                })
            }

            if(typeProduct) {
                // Validar o campo typeProduct
                const productTypeOk = validaProductType(typeProduct)
                if(!productTypeOk) {
                    return res.status(400).json({
                        message: 'Campo tipo do produto mal formatado',
                        cause: 'O campo de ter o valor: "Medicamento Controlado" ou "Medicamento Não Controlado"'
                    });
                }
                filter.typeProduct = typeProduct;
                productsByUserAdmin = await Product.findAndCountAll({
                    where: { user_id: decodedToken.id, ...filter },
                    order,
                    valueOffset,
                    valueLimit,
                })
            }
            
            if(!name && !typeProduct) {
                productsByUserAdmin = await Product.findAndCountAll({
                    where: { user_id: decodedToken.id},
                    order,
                    valueOffset,
                    valueLimit,
                })
            }
            
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
                cause: error.message
            })
        }
    }

    async listAllProducts(req, res) {
        //#swagger.tags = ['Product']
        const { authorization } = req.headers;
        const { offset, limit } = req.params;
        const { name, typeProduct, totalStock } = req.query;

        try {
            // Verificar dados passados no headers
            await validaAuthorizationHeaders(authorization, res);

            // Filtrar produtos com base no query params
            const filter = {};
            if(name) {
                filter.name = name;
            }

            if(typeProduct) {
                // Validar o campo typeProduct
                const productTypeOk = validaProductType(typeProduct)
                if(!productTypeOk) {
                    return res.status(400).json({
                        message: 'Campo tipo do produto mal formatado',
                        cause: 'O campo de ter o valor: "Medicamento Controlado" ou "Medicamento Não Controlado"'
                    });
                }
                filter.typeProduct = typeProduct;
            }
            
            // Verificar se o campo totalStock é um valor numérico
            if (isNaN(Number(totalStock)) || totalStock < 0) {
                return response.status(400).send({
                    message: "O campo totalStock deve possuir um valor numérico válido!" 
                });
            }

            // Ordenar pelo total do estoque
            const order = [['total_stock', totalStock === 'asc' ? 'ASC' : 'DESC']];

            // Validar os campos offset e limit
            const valueOffset = parseInt(offset);
            const valueLimit = parseInt(limit);
            if (isNaN(valueOffset) || isNaN(valueLimit) || valueLimit <= 0 || valueLimit > 20) {
                return res.status(400).json({
                    message: 'Parâmetros de paginação inválidos',
                    cause: error.message
                });
            }
            
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
                data: allProducts,
                totalResults: allProducts.count,
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                cause: error.message,
            })    
        }
    }

    async listProductById(req, res) {
        //#swagger.tags = ['Product']
        const { authorization } = req.headers;
        const { productId } = req.params;
        
        try {
            // Verificar dados passados no headers
            await validaAuthorizationHeaders(authorization, res);
            
            // Verificar se o id do produto foi passado por parametro
            if(!productId) {
                return res.status(401).json({
                    message: 'Id do produto não fornecido',
                })
            }

            // Verificar se o productId é um valor numérico
            if (isNaN(Number(productId)) || productId < 0) {
                return response.status(400).send({
                    message: "O id do produto deve possuir um valor numérico válido!" 
                });
            }

            // Consultar um produto pelo seu código
            const returnedProduct = await Product.findByPk(productId);
            if(!returnedProduct) {
                return res.status(404).json({
                    message: 'Produto não encontrado',
                })
            }

            return res.status(200).json({
                message: 'Produto encontrado com sucesso',
                data: returnedProduct,
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                cause: error.message,
            })
        }
    }

    async updateProductById(req, res) {
        //#swagger.tags = ['Product']
        const { authorization } = req.headers;
        const { productId } = req.params;
        const { name, imageLink, dosage, totalStock } = req.body;

        try {
            // Verificar dados passados no headers
            await validaAuthorizationHeaders(authorization, res);

            // Verificar se o id do produto foi passado por parametro
            if(!productId) {
                return res.status(401).json({
                    message: 'Id do produto não fornecido',
                })
            }

            // Verificar se o productId é um valor numérico
            if (isNaN(Number(productId)) || productId <= 0) {
                return response.status(400).send({
                    message: "O id do produto deve possuir um valor numérico válido!" 
                });
            }

            // Verificar se o pruduto existe
            const returnedProduct =await Product.findByPk(productId);
            if(!returnedProduct) {
                return res.status(400).json({
                    message: 'Produto não encontrado',
                })
            }

            // Verificar se o campo totalStock é um valor numérico
            if (isNaN(Number(totalStock)) || totalStock < 0) {
                return response.status(400).send({
                    message: "O campo totalStock deve possuir um valor numérico válido!" 
                });
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
                cause: error.message,
            })
        }
    }
}

module.exports = new ProductController();