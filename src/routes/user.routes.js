const { Router } = require('express');
const UserController = require('../controller/user.controller');
//const authMiddleware = require('../middleware/auth');
class UserRouter {
  routesFromUser() {
    const userRoutes = Router();
    userRoutes.post("/user/login", UserController.loginUser);
    userRoutes.post('/admin/login', UserController.loginAdminUser);
    userRoutes.post('/user/signup', UserController.buyerSignup);
    userRoutes.post('/user/admin/signup', UserController.adminSignup);
    //userRoutes.post('/user/admin/signup', authMiddleware, UserController.adminSignup);
    return userRoutes;
  }
}

module.exports = new UserRouter();