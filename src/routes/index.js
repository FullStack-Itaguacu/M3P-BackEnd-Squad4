const { Router } = require("express");
const { routesFromBuyer } = require("./buyer.routes");
const { routesFromProduct } = require("./product.routes");
const { routesFromUser } = require("./user.routes");
const routes = new Router();

routes.use('/api', [
   routesFromBuyer(),
   routesFromProduct(),
   routesFromUser(),
]);

module.exports = routes;
