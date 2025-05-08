const router = require("express").Router();
const { validateUserId } = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.use(auth);

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserId, updateUser);

module.exports = router;
