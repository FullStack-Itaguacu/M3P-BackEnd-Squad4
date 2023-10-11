const { Router } = require("express");
const { auth } = require("../middleware/auth");
const BuyerAddressController = require("../controller/buyers/buyers.controller");

class BuyerAddressRouter {
  routesFromBuyerAddress() {
    const buyerRoutes = Router();

    // Adicione a autenticação como middleware antes da rota
    buyerRoutes.use(auth);

    buyerRoutes.get(
      "/buyers/address",
      BuyerAddressController.listUserAddresses
    );
  
    return buyerRoutes;
  }
}

module.exports = new BuyerAddressRouter();
