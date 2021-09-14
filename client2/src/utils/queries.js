import { gql } from "@apollo/client";

export const QUERY_USERS = gql`
  query allUsers {
    users {
      _id
      username
      password
    }
  }
`;

export const QUERY_SINGLE_USER = gql`
  query singleUser($userId: String!) {
    user(userId: $userId) {
      _id
      username
      password
    }
  }
`;
