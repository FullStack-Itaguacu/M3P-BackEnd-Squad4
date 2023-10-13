const { Router } = require("express");
const { routesFromBuyer } = require("./buyer.routes");
const { routesFromProduct } = require("./product.routes");
const routes = new Router();

// routes.use();
routes.use('/api', [
   routesFromBuyer(),
   routesFromProduct()
]);


module.exports = routes;
