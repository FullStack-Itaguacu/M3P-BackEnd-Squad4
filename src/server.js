const express = require("express");
const cors = require("cors");
const { connection } = require("./database/connection");
const routes = require("./routes");
const { server_port } = require("./config/database.config");

class Server {
  constructor(app = express()) {
    this.initializeServer(app);
    this.middlewares(app);
    this.allRoutes(app);
    this.database();
  }

  async initializeServer(app) {
    app.listen(server_port, () =>
      console.log(`Servidor escutando na porta ${server_port}.`)
    );
  }

  async middlewares(app) {
    app.use(cors());
    app.use(express.json());
  }

  async allRoutes(app) {
    app.use(routes);
  }

  async database() {
    try {
      await connection.authenticate();
      console.log("Conexão com banco de dados bem sucedida.");
    } catch (error) {
      console.log("Não foi possível se conectar ao banco de dados.", error);
    }
  }
}

module.exports = { Server };
