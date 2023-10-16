const { Router } = require('express');
const UserController = require('../controller/user.controller');

class UserRouter {
  routesFromUser() {
    const userRoutes = Router();
    userRoutes.post("/user/login", UserController.loginUser);
    userRoutes.post('/admin/login', UserController.loginAdminUser);
    userRoutes.post('/user/signup', UserController.buyerSignup);

    return userRoutes;
  }
}

module.exports = new UserRouter();