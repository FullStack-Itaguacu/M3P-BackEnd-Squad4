const { Router } = require('express');
const UserController = require('../controller/user.controller');

class UserRouter {
  routesFromUser() {
    const userRoutes = Router();
    userRoutes.post("/user/login", UserController.loginUser);


    return userRoutes;
  }
}

module.exports = new UserRouter();