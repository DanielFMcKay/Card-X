// resolvers is for the query
const { AuthenticationError } = require("apollo-server-express");

const { User, Card } = require("../models/index");
const { signToken } = require("../utils/auth");

const updateCardAuthors = async (oldUsername, newUsername) => {
  await Card.updateMany({ cardAuthor: oldUsername }, { $set: { cardAuthor: newUsername } });
};

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      console.log(context.user._id);
      console.log("BACKEND HIT")
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('cards');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    users: async () => {
      return User.find().populate('cards');
    },

    singleUser: async (parent, { userId }) => {
      return User.findOne({ _id: userId }).populate('cards');;
    },

    cards: async () => {
      return Card.find();
    },

    singleCard: async (parent, { cardId }) => {
      console.log("hit singlecard", cardId)
      return Card.findOne({ _id: cardId });
    },
  },
  Mutation: {
    login: async (root, { email, password }) => {
      console.log("LOGIN_USER");
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user with this email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (root, { username, email, password }) => {
      console.log("ADD_USER");
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    createCard: async (root, { details, title, date, picture }, context) => {
      console.log("CREATE_CARD");
      if (context.user){
        const cardData = { details, title, date, picture, cardAuthor: context.user.username, };

        const card = await Card.create(cardData);
      
        await User.findOneAndUpdate(
          { _id: context.user._id},
          { $addToSet: { cards: card._id } }
        );
        console.log(User);

        return card;
      }
    },
    removeCard: async (root, { cardId }, context) => {
      console.log("DELETE");
      if (context.user) {
        // Attempt to delete the card
        const deletedCard = await Card.findOneAndDelete({ _id: cardId });

        // Check if the card was successfully deleted
        if (!deletedCard) {
          throw new Error("Card not found or already deleted.");
        }
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { cards: { _id: cardId } } },
          { new: true }
        );

        return "Card successfully removed";
      }
      else throw new AuthenticationError("No user context");
    },
  
  updateUser: async (root, { username, email, password }, context) => {
      console.log("UPDATE_USER");
      if (context.user) {

        if (context.user._id.toString() === userId) {
          // Get the old username before updating the user
           const oldUsername = context.user.username;


          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { username, email, password },
            { new: true, runValidators: true }
          );

          // Check if the username has changed
        if (username !== oldUsername) {
          // Update the cardAuthor in all cards with the old username to the new username
          await updateCardAuthors(oldUsername, username);
        }; 
        return updatedUser;
     } else {
       throw new AuthenticationError("You can only update your own user details!");
     }
     }
    },

    // Mutation to update a card's details
    // updateCard: async (root, { cardId, details, title, date, picture,  }, context) => {
    //   console.log("UPDATE_CARD");

    //   if (context.user) {
    //     const updatedCard = await Card.findByIdAndUpdate(
    //       { _id: cardId },
    //       { details, title, date, picture },
    //       { new: true, runValidators: true }
    //     );
    //     await User.findOneAndUpdate(
    //       { _id: context.user._id  },
    //       { $addToSet: { cards: updatedCard._id } }
    //     );
    //     return updatedCard;
    //   }
    //   else throw new AuthenticationError("No user context");
    // },
  }
};



module.exports = resolvers;
