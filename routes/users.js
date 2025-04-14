const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, updateProfile } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");

// Protect the routes below with the auth middleware
router.use(auth);

router.get("/me", getCurrentUser); // Get the current user
router.patch("/me", validateUserUpdate, updateProfile); // Update the user data

module.exports = router;
