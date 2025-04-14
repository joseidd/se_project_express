const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const BadRequestError = require("../custom_errors/bad-request-err");
const NotFoundError = require("../custom_errors/not-found-err");
const ConflictError = require("../custom_errors/conflict-err");
const UnauthorizedError = require("../custom_errors/unauthorized-err");

const { JWT_SECRET } = require("../utils/config"); // Import the JWT secret

// route handler to create a new user
const createUser = (req, res, next) => {
  const { name, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 12) // hash the password
    .then((hash) => User.create({ name, avatar, email, password: hash })) // create the user with the hashed password
    .then((user) => {
      const responseUser = user.toObject(); // convert the user to a plain object
      delete responseUser.password; // omit the password hash from the response sent after a new user is created
      res.status(201).send(responseUser); // send the user without the password
    })
    .catch((err) => {
      console.error(err); // all catch blocks should log the error
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      }
      if (err.code === 11000) {
        next(new ConflictError("Email already in use"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  // login function calls User.findUserByCredentials with the provided email and password. If the credentials are correct, it generates a JWT token and sends it in the response
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "UnauthorizedError") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

// route handler to find the current user
const getCurrentUser = (req, res, next) => {
  // const { userId } = req.params;
  const userId = req.user._id; // Instead of pulling the ID from req.params, access it from the req.user object that is set in the auth middleware
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID provided"));
      } else {
        next(err);
      }
    });
};

// route handler to update user data
const updateProfile = (req, res, next) => {
  const userId = req.user._id; // access the user ID from req.user
  const { name, avatar } = req.body;
  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true } // return the updated document and enforce validation
  )
    .then((user) => res.send({ data: user })) // handle success
    .catch((err) => {
      // handle rejected state
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, login, getCurrentUser, updateProfile };
