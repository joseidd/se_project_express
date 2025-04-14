const ClothingItems = require("../models/clothingItems"); // Import the ClothingItems model

const BadRequestError = require("../custom_errors/bad-request-err");
const NotFoundError = require("../custom_errors/not-found-err");
const ForbiddenError = require("../custom_errors/forbidden-err");



// route handler to create a new item
const createItem = (req, res, next) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id; // Access the hardcoded user ID from app.js

  ClothingItems.create({
    name,
    weather,
    imageUrl,
    owner: userId,
  })
    .then((item) => {
      // if successful, send the item back
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      // if not successful, send an error message
      console.error(e);
      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(e);
      }
    });
};

// route handler to get all items
const getItems = (req, res, next) => {
  ClothingItems.find({})
    .then((items) => res.send(items))
    .catch((e) => {
      console.error(e);
      next(e);
    });
};

// route handler to delete an item
const deleteItem = (req, res, next) => {
  const { itemId } = req.params; // Get the item ID from the request parameters
  const owner = req.user._id; // Get the owner ID from the request user

  ClothingItems.findById(itemId)
    .orFail() // If the item is not found, throw an error to .catch() block
    .then((item) => {
      console.log(item);
      if (String(item.owner) !== owner) {
        // Check if the owner of the item matches the user making the request
        throw new ForbiddenError("You are not authorized to delete this item");
      }
      return item
        .deleteOne() // If the owner matches, delete the item
        .then(() =>
          // Send a success message
          res.send({ message: "Item deleted", data: item })
        );
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(e);
      }
    });
};

// Like an item by ID
const likeItem = (req, res, next) => {
  const userId = req.user._id; // Access the hardcoded user ID from app.js

  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } }, // Add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.setHeader("Content-Type", "application/json");
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(e);
      }
    });
};

// Dislike an item by ID
const dislikeItem = (req, res, next) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // Remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.setHeader("Content-Type", "application/json");
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Invalid ID"));
      } else {
        next(e);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
