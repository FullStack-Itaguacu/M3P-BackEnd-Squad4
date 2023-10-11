const { Router } = require("express");
const { routesFromBuyers } = require("./buyers.routes");
const routes = new Router();

// routes.use();
routes.use('/api', [
   routesFromBuyers()
]);



module.exports = routes;
