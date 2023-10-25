const { Router } = require("express");
const { auth } = require("../middleware/auth");
const {
  listUserAddresses,
  listAllBuyers,
  getUserById,
  updateBuyer,
} = require("../controller/buyer.controller");

class BuyerRouter {
  routesFromBuyer() {
    const buyerRoutes = Router();
    buyerRoutes.get("/buyers/address", auth, listUserAddresses);
    buyerRoutes.get("/buyers/admin/:offset/:limit", auth, listAllBuyers);
    buyerRoutes.get("/buyers/admin/:userId", auth, getUserById);
    buyerRoutes.patch("/buyers/admin/:userId", auth, updateBuyer);
    return buyerRoutes;
  }
}

module.exports = new BuyerRouter();
