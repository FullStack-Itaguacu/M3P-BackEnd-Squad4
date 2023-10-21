const { Router } = require("express");
const { routesFromBuyer } = require("./buyer.routes");
const { routesFromProduct } = require("./product.routes");
const { routesFromUser } = require("./user.routes");
const { routesFromSale } = require('./sale.routes')
const routes = new Router();

routes.use('/api', [
   routesFromBuyer(),
   routesFromProduct(),
   routesFromUser(),
   routesFromSale()
]);

module.exports = routes;
