const router = require("express").Router();

const {
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItem);

// router.post("/", validateCardBody, createClothingItem);
// router.delete("/:itemId", validateItemId, deleteClothingItem);
// router.put("/:itemId/likes", validateItemId, likeItem);
// router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
