const { Thought, User } = require("../models");

const thoughtController = {
    //GET all thoughts
    getAllThoughts(req,res) {
        Thought.find({})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        // .sort({_id: -1})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    //GET thought by ID
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({path: "thoughts"})
        .then((dbThoughData) => {
            if (!dbThoughData) {
                res.status(404).json({ message: "No thought found by that id!"});
                return;
            }
            res.json(dbThoughData);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },
    //POST Create new thought
    addThought({params, body}, res) {
        Thought.create(body)
        .then((_id) => {
            return User.findOneAndUpdate(
                { _id: params.userId },
                { $push: {thoughts: _id } },
                { new: true }
            );
        })
        .then((dbThoughtData) => {
            console.log(dbThoughtData);
            if (!dbThoughtData) {
                res.status(404).json({ message: "Thought created but no user with this id!" });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },

    // PUT to update thought by ID
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
            new: true, 
            runValidators: true,
        })
        .then((dbThoughData) => {
            if (!dbThoughData) {
                res.status(404).json({ message: "No thought found with this id!"});
                return;
            }
            res.json(dbThoughData);
        })
        .catch((err) => res.status(400).json(err));
    },
    //DELETE Remove Thought by ID
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
          .then((deletedThought) => {
            if (!deletedThought) {
              return res.status(404).json({ message: "No thought with this id! " });
            }
            console.log(deletedThought);
            User.findOneAndUpdate(
              { username: deletedThought.username },
              { $pull: { thoughts: params.thoughtId } },
              { new: true }
            );
          })
          .then((dbThoughData) => {
            if (!dbThoughData) {
              res.status(404).json({ message: "No user found with this id!" });
              return;
            }
            res.json(dbThoughData);
          })
          .catch((err) => res.json(err));
      },
      //POST  create Reaction
      addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $push: { reactions: body } },
          { new: true, runValidators: true }
        )
          .then((dbThoughData) => {
            if (!dbThoughData) {
              res.status(404).json({ message: "No user found with this id!" });
              return;
            }
            res.json(dbThoughData);
          })
          .catch((err) => res.json(err));
      },
      // DELETE Remove reaction by reaction's Id
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      // remove specific reply from replies array
      // where replyId matches value of params.replyId passed in from route
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughData) => res.json(dbThoughData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;