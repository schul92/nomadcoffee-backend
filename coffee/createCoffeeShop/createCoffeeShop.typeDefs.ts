
import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    createCoffeeShop(
      name: String!
      files: Upload
      category: String
    ): MutationResponse!
  }
`;