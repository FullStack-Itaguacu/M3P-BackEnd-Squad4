const { Router } = require("express");
const { routesFromBuyer } = require("./buyer.routes");
const routes = new Router();

// routes.use();
routes.use('/api', [
   routesFromBuyer()
]);



module.exports = routes;
