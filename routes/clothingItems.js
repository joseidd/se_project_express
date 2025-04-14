const router = require("express").Router();
const auth = require("../middlewares/auth"); // Import the auth middleware

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { validateCardBody, validateID } = require("../middlewares/validation");

// get all items
router.get("/", getItems);

// protect routes
router.use(auth);

// protected routes:
// create a new item
router.post("/", validateCardBody, createItem);

// delete an item by ID
router.delete("/:itemId", validateID, deleteItem);

// like an item by ID
router.put("/:itemId/likes", validateID, likeItem);

// unlike an item by ID
router.delete("/:itemId/likes", validateID, dislikeItem);

module.exports = router;
