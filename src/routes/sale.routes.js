const { Router } = require("express");
const { createOneSale, listSale, listSaleByAdmin, listResultByAdmin } = require("../controller/sale.controller");
//const { auth } = require("../middleware/auth");


class SaleRouter {
    routesFromSale(){
        const saleRoutes = Router();
        //saleRoutes.use(auth);
        saleRoutes.post('/sales/', createOneSale);
        saleRoutes.get('/sales/', listSale);
        saleRoutes.get('/sales/admin', listSaleByAdmin);
        saleRoutes.get('/sales/admin', listResultByAdmin);
       
        return saleRoutes;
    }
}

module.exports = new SaleRouter();