const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const member = require("../../middleware/member");
const { check } = require("express-validator");
const CardController = require("../../controllers/card.controller");

// Add a card
router.post(
  "/",
  [auth, member, [check("title", "Title is required").not().isEmpty()]],
  CardController.createCard
);

// Get all of a list's cards
router.get("/listCards/:listId", auth, CardController.getAllCardsByListId);

// Get a card by id
router.get("/:id", auth, CardController.getCardById);

// Edit a card's title, description, and/or label
router.patch("/edit/:id", [auth, member], CardController.editCard);

// Archive/Unarchive a card
router.patch(
  "/archive/:archive/:id",
  [auth, member],
  CardController.archiveCard
);

// Move a card
router.patch("/move/:id", [auth, member], CardController.moveCard);

// Add/Remove a member
router.put(
  "/addMember/:add/:cardId/:userId",
  [auth, member],
  CardController.addRemoveMember
);

// Delete a card
router.delete("/:listId/:id", [auth, member], CardController.deleteCard);

module.exports = router;
