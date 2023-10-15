const { Router } = require("express");
const { routesFromUser } = require("./user.routes");
const { routesFromBuyer } = require("./buyer.routes");
const { routesFromProduct } = require("./product.routes");

const routes = new Router();


routes.use('/api', [

   routesFromUser(),
   routesFromBuyer(),
   routesFromProduct()

]);



module.exports = routes;
