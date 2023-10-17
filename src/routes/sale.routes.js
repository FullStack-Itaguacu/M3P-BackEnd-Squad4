const { Router } = require("express");
const { createOneSale, listSale, listSaleByAdmin, listResultByAdmin } = require("../controller/sale.controller");
const { auth } = require("../middleware/auth");


class SaleRouter {
    routesFromSale(){
        const saleRoutes = Router();
        
        saleRoutes.post('/sales/',auth, createOneSale);
        saleRoutes.get('/sales/',auth, listSale);
        saleRoutes.get('/sales/admin',auth, listSaleByAdmin);
        saleRoutes.get('/sales/admin',auth, listResultByAdmin);
       
        return saleRoutes;
    }
}

module.exports = new SaleRouter();