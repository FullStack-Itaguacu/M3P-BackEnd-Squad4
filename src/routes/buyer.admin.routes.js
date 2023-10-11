const { Router } = require("express");
const { auth } = require("../middleware/auth");
const  BuyersAdmin = require("../controller/buyers/buyers.admin.controller");

class BuyerAdminRouter {
  routesFromBuyerAdmin() {
    const buyerAdminRoutes = Router();

    buyerAdminRoutes.use(auth);

    buyerAdminRoutes.get('/buyers/admin/:offset/:limit', BuyersAdmin.listAllBuyers);
  
    return buyerAdminRoutes;
  }
}

module.exports = new BuyerAdminRouter();
