const { verify } = require("jsonwebtoken");
const { jwt_secret_key } = require("../config/database.config");

async function auth(request, response, next) {
  try {
    const { authorization } = request.headers;
    request["payload"] = verify(authorization, jwt_secret_key);
    next();
  } catch (error) {
    return response.status(401).send({
      message: "Falha na autenticação",
      cause: error.message,
    });
  }
}

module.exports = { auth };
