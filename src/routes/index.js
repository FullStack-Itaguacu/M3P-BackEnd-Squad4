const { Router } = require("express");
const { routesFromBuyerAddress } = require("./buyer.routes");
const { routesFromUser } = require("./user.routes");
const routes = new Router();


routes.use('/api', [
   routesFromBuyerAddress(),
   routesFromUser(),

]);



module.exports = routes;
