const { Book, User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        console.log('/n /n get user',context.user);
        const user = await User.findOne({_id: context.user._id}).select("-__v -password");
      return User;
      }
    throw AuthenticationError
    },
  },
    Mutation: {
      addUser: async (parent, args) => {
        try {
          const user = await User.create(args);
          const token = signToken(user);
          return { token, user };
        } catch (error) {
          console.error(error);
          throw new Error("Failed to add a new user.");
        }
      },
      login: async (parent, { email, password }) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            throw new AuthenticationError("Incorrect email");
          }
          const correctPw = await user.isCorrectPassword(password);
          if (!correctPw) {
            throw new AuthenticationError("Incorrect password");
          }
          const token = signToken(user);
          return { token, user };
        } catch (error) {
          console.error(error);
          throw new Error("Failed to log in. Please check your credentials.");
        }
      },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: bookData } },
            { new: true }
          );
          return updatedUser;
        } catch (error) {
          console.error(error);
          throw new Error("Failed to save the book. Please try again.");
        }
      } else {
        throw new AuthenticationError("You must be logged in to save a book.");
      }
    },
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { savedBooks: { bookId: bookId } }, 
          { new: true }
        );
        return updatedUser;
      }
    },
  },
};

module.exports = resolvers;