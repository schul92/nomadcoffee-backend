import bycrypt from "bcrypt";
import client from "../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { username, email, name, locaction, password, avatarURL, githubUsername }
    ) => {
      const exitingUser = await client.user.findFirst({
        where: {
          OR: [
            {
              username,
            },
            {
              email,
            },
          ],
        },
      });
      const uglyPassword = await bycrypt.hash(password, 10);
      return client.user.create({
        data: {
          username,
          email,
          name,
          password: uglyPassword,
        },
      });
    },
  },
};
