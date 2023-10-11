const { Router } = require("express");
const { auth } = require("../middleware/auth");
const BuyersController = require("../controller/buyers.controller");

class BuyersRouter {
  routesFromBuyers() {
    const buyersRoutes = Router();

    // Adicione a autenticação como middleware antes da rota
    buyersRoutes.use(auth);

    buyersRoutes.get(
      "/buyers/address",
      BuyersController.listUserAddresses
    );
    buyersRoutes.get('/buyers/admin/:offset/:limit', BuyersController.listAllBuyers);
  
    return buyersRoutes;
  }
}

module.exports = new BuyersRouter();
