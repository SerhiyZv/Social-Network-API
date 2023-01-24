const { User } = require("../models");

const userController = {
    //Get all users
    getAllUsers(req, res) {
        User.find({})
            .sort({_id: -1})
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //GEt User by ID and populate thoughts and friend data
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .select('-__v')
        .populate({ path: "friends", })
        .populate({ path: "thoughts", })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => { console.log(err);
        res.status(400).json(err);
        });
    },
    //POST new user
    createUser({ body }, res) {
        User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(400).json(err));
    },
    //PUT to update user by _id
    updateUser({ params,  body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidator: true, })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {res.status(400).json(err)});
    },
    //DELETE to remove user _id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then((dbUserData) => {
                if(!dbUserData) {
                    return res.status(404).json({ message: "No user found with this id!" });
                }
                // BONUS: get ids of user's `thoughts` and delete them all
        // $in to find specific things
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
            })
            .then(() => {
                res.json({ message: "User and associated thoughts deleted!" });
              })
            .catch((err) => res.json(err));
    },
    //POST Add new friend to user's friend list
    addFriend({ params, body }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { friends: params.friendId } },
          { new: true, runValidators: true }
        )
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "No user found with this id!" });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => res.json(err));
      },
      //DELETE Remove friend from user's friend list
      removeFriend({ params }, res) {
        console.log("remove friend", params.friendId);
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
          { new: true }
        )
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.json(err));
      },
};

module.exports = userController;