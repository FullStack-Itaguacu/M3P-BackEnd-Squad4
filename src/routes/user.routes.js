const { Router } = require('express');
const UserController = require('../controller/user.controller');

class UserRouter {
  routesFromUser() {
    const userRoutes = Router();
    userRoutes.post("/user/login", UserController.loginUser);
<<<<<<< HEAD
    userRoutes.post('/admin/login', UserController.loginAdminUser);
=======

>>>>>>> a010438af5e453ab87a8e10e3af59c498e02d2ae

    return userRoutes;
  }
}

module.exports = new UserRouter();