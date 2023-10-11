const { Router } = require("express");
const { auth } = require("../middleware/auth");
const BuyerController = require("../controller/buyer.controller");

class BuyerRouter {
  routesFromBuyer() {
    const buyerRoutes = Router();

    // Adicione a autenticação como middleware antes da rota
    buyerRoutes.use(auth);

    buyerRoutes.get(
      "/buyers/address",
      BuyerController.listUserAddresses
    );
    buyerRoutes.get('/buyers/admin/:offset/:limit', BuyerController.listAllBuyers);
    buyerRoutes.get('/buyers/admin/:userId', BuyerController.listAllBuyers);
  
    return buyerRoutes;
  }
}

module.exports = new BuyerRouter();