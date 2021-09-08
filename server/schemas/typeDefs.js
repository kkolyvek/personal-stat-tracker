const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    password: String!
  }

  type Query {
    users: [User]!
    user(userId: ID!): User
  }
`;

module.exports = typeDefs;
