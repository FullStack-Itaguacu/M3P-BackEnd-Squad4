const { Router } = require("express");
const { auth } = require("../middleware/auth");
const {
  createOneProduct,
  listAllProductsByUser,
  listAllProducts,
  listProductById,
  updateProductById,
} = require("../controller/product.controller");

class ProductRouter {
  routesFromProduct() {
    const productRoutes = Router();
    productRoutes.post("/products/admin", auth, createOneProduct);
    productRoutes.get("/products/admin/:offset/:limit", auth, listAllProductsByUser);
    productRoutes.get("/products/:offset/:limit", auth, listAllProducts);
    productRoutes.get("/products/:productId", auth, listProductById);
    productRoutes.patch("/products/admin/:productId", auth, updateProductById);
    return productRoutes;
  }
}

module.exports = new ProductRouter();
