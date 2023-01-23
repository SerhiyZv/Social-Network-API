const router = require("express").Router();

const { getAllThoughts, getThoughtById, addThought, updateThought, removeThought, addReaction, removeReaction, 
} = require("../../controllers/thoughtController");

// /api/thoughts/
router.route("/").get(getAllThoughts).post(addThought);

// /api/thoughts/:id
router.route("/:id").get(getThoughtById).put(updateThought).delete(removeThought);

// -- Directs to: /api/thoughts/:userId <POST>
router.route('/:userId').post(addThought);

// /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions").post(addReaction);

// /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;