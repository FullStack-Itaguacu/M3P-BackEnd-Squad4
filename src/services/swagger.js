const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: '1.0.0',
        title: 'LabPharmacy API',
        description: 'Documentação da API LabPharmacy para gerenciamento de farmácias.',
    },
    host: 'localhost:3333',
    basePath: '/',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
    apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization',
            description: 'Autenticação JWT',
        },
    },
    security: [{ apiKeyAuth: [] }],
    definitions: {
        User: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 15 },
                fullName: { type: 'string', example: 'Pedro Silva' },
                cpf: { type: 'string', example: '55555555555' },
                birthDate: { type: 'string', format: 'date', example: '1980-10-10' },
                email: { type: 'string', example: 'pedro@gmail.com' },
                phone: { type: 'string', example: '55555555555' },
                address: { type: 'object' }, // Novo campo para o endereço
                typeUser: { type: 'string', enum: ['Administrador', 'Comprador'], example: 'Comprador' },
            },
        },
        Address: {
            type: 'object',
            properties: {
                numberStreet: { type: 'integer', example: 219 },
                street: { type: 'string', example:'Lauro Linhares' },
                neighborhood: { type: 'string', example: 'Trindade' },
                city: { type: 'string', example: 'Florianópolis' },
                state: { type: 'string', example: 'SC' },
                zip: { type: 'string',example: '66395222' },
            },
        },
        Product: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 5 },
                name: { type: 'string', example: 'Paracetamol' },
                labName: { type: 'string', example: 'Pfizer' },
                imageLink: { type: 'string', example: 'url string' },
                dosage: { type: 'string', example: 'mg'},
                description: { type: 'string', example: 'Dscrição do produto' },
                unit_price: { type: 'number', example: 100.15 },
                type_product: { type: 'string', example: 'Medicamento Controlado'},
                total_stock: { type: 'integer', example: 18 },
            },
        },
        Sale: {
            type: 'object',
            properties: {
                id: { type: 'integer', example: 5 },
                unitPrice: { type: 'real', example: 10.00 },
                amountBuy: { type: 'integer', example: 200 },
                total: { type: 'real', example: 20.00 },
                typePayment: { type: 'string', example: 'PIX'},
                buyerId: { type: 'integer', example: 20 },
                sellerId: { type: 'integer', example: 15 },
                productId: { type: 'integer', example: 3},
                usersAddressesId: { type: 'integer', example: 18 },
            },
        },
    },
};

const outputFile = './swagger-output.json'
const endpointsFiles = ['../routes/index.js']

swaggerAutogen(outputFile, endpointsFiles, doc)