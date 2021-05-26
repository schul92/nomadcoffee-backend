import { gql } from "apollo-server";

export default gql`
  type User {
    id: String!
    username: String!
    email: String!
    name: String!
    location: String
    avatarURL: String
    githubUsername: String
  }
  type Mutation {
    createAccount(
      username: String!
      email: String!
      name: String!
      locaction: String
      password: String!
      avatarURL: String
      githubUsername: String
    ): User
  }
  type Query {
    seeProfile(username: String!): User
  }
`;