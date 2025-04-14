// const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../custom_errors/unauthorized-err");

function auth(req, res, next) {
  const { authorization } = req.headers; // Get the authorization header from the request

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // Check if the authorization header is present and starts with "Bearer "
    throw new UnauthorizedError("Authorization required"); // If not, throw an error
  }

  // Extract the token from the authorization header
  const token = authorization.replace("Bearer ", "");
  let payload; // Initialize the payload variable

  // Verify the token
  try {
    payload = jwt.verify(token, JWT_SECRET); // Use the JWT_SECRET to verify the token
  } catch (err) {
    throw new UnauthorizedError("Authorization failed"); // If verification fails, throw an error
  }

  req.user = payload; // Add the payload to the request object

  return next(); // Pass control to the next middleware function and return
}

module.exports = auth;
