const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth.js");

const resolvers = {
  Query: {
    users: async () => {
      return User.find();
    },

    user: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
  },

  Mutation: {
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError("No profile with this username.");
      }
      const correctPw = await user.comparePassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect password.");
      }
      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
