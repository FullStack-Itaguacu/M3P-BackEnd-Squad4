const { Router } = require("express");
<<<<<<< HEAD
const { routesFromBuyerAddress } = require("./buyer.routes");
const { routesFromUser } = require("./user.routes");
=======

const { routesFromUser } = require("./user.routes");

const { routesFromBuyer } = require("./buyer.routes");
const { routesFromProduct } = require("./product.routes");

>>>>>>> a010438af5e453ab87a8e10e3af59c498e02d2ae
const routes = new Router();


routes.use('/api', [
<<<<<<< HEAD
   routesFromBuyerAddress(),
   routesFromUser(),
=======

   routesFromUser()


   routesFromBuyer(),
   routesFromProduct()
>>>>>>> a010438af5e453ab87a8e10e3af59c498e02d2ae

]);



module.exports = routes;
