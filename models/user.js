const mongoose = require("mongoose");

const validator = require("validator");

// const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "The email field is required."],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "The password field is required."],
    select: false, // User's password hash will not be returned by any search queries
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email }) // find a user by email and include the password field in the result
    .select("+password")
    .then((user) => {
      if (!user) {
        const error = new Error("Incorrect email or password");
        error.name = "UnauthorizedError";
        return Promise.reject(error); // reject the promise with an error if the user is not found
      }
      // if the user is found, compare the provided password with the stored hashed password using bcrypt.compare
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error("Incorrect email or password");
          error.name = "UnauthorizedError";
          return Promise.reject(error); // reject the promise with an error if the passwords do not match
        }
        // if the passwords match, resolve the promise with the user object
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
