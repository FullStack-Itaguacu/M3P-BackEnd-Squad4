const { Router } = require("express");
const { 
    createOneProduct, 
    listAllProductsByUser, 
    listAllProducts, 
    listProductById, 
    updateProductById
} = require("../controller/product.controller");

const { auth } = require("../middleware/auth");


class ProductRouter {
    routesFromProduct(){
        const productRoutes = Router();

        // Adicione a autenticação como middleware antes de cada rota
        productRoutes.use(auth);

        productRoutes.post('/products/admin', createOneProduct);
        productRoutes.get('/products/admin/:offset/:limit', listAllProductsByUser);
        productRoutes.get('/products/:offset/:limit', listAllProducts);
        productRoutes.get('/products/:productId', listProductById);
        productRoutes.patch('/products/admin/:productId', updateProductById);

        return productRoutes;
    }
}

module.exports = new ProductRouter();