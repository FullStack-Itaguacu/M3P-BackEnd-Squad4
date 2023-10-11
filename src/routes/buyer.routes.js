const { Router } = require("express");
const { auth } = require("../middleware/auth");
const BuyerController = require("../controller/buyer.controller");

class BuyerRouter {
  routesFromBuyer() {
    const buyerRoutes = Router();

    // Adicione a autenticação como middleware antes da rota
    buyerRoutes.use(auth);

    buyerRoutes.get(
      "/buyer/address",
      BuyerController.listUserAddresses
    );
    buyerRoutes.get('/buyer/admin/:offset/:limit', BuyerController.listAllBuyer);
  
    return buyerRoutes;
  }
}

module.exports = new BuyerRouter();
