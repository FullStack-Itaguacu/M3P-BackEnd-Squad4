const { User } = require('../models/user');
const { validateField } = require('../utils/validateField');
const {Product} = require('../models/product')

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
                validateFieldField('name', product.name),
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

            // Crie o produto (simulação)
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
                message: 'Registro criado com sucesso.',
                data: newProduct,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Ocorreu um erro interno no servidor.',
                error: error.message,
            });     
        }
    }

}

module.exports = new ProductController();