import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    editProfile(
      name: String
      location: String
      email: String
      password: String
      avatar_url: Upload
      github_username: String
    ): MutationResponse!
  }
`;
