const { Router } = require("express");
const { routesFromBuyer } = require("./buyer.routes");
const { routesFromProduct } = require("./product.routes");
const { routesFromUser } = require("./user.routes");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../services/swagger-output.json');

const { routesFromSale } = require('./sale.routes')
const routes = new Router();

routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
routes.use('/api', [
   routesFromBuyer(),
   routesFromProduct(),
   routesFromUser(),
   routesFromSale()
]);

module.exports = routes;
