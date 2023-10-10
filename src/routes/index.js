const { Router } = require("express");
const { routesFromBuyerAddress } = require("./buyer.routes");
const routes = new Router();

// routes.use();
routes.use('/api', [
   routesFromBuyerAddress()
]);



module.exports = routes;
