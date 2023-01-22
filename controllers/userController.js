const { User } = require("../models");

const userController = {
    //Get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({ path: "thoughts", })
            .populate({ path: "friends",  })
            .sort({_id: -1})
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //GEt User by ID and populate thoughts and friend data
    getUserById({ param }, res) {
        User.findOne({ _id: param.id })
        .select('-__v')
        .populate( "thoughts" )
        .populate({ path: "friends", })
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
    updateUser({ body }, res) {
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
                    res.status(404).json({ message: "No user found with this id!" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                res.status(400).json(err);
            })
    },
    //POST Add new friend to user's friend list
    addFriend({ params, body }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { friends: body } },
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
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: { friendId: params.friendId } } },
          { new: true }
        )
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.json(err));
      },
};

module.exports = userController;