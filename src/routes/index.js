const { Router } = require("express");
const { routesFromBuyerAddress } = require("./buyer.routes");
const { routesFromBuyerAdmin } = require("./buyer.admin.routes");
const routes = new Router();

// routes.use();
routes.use('/api', [
   routesFromBuyerAddress(), routesFromBuyerAdmin()
]);



module.exports = routes;
