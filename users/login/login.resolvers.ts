import * as bcrypt from "bcrypt";

import * as jwt from "jsonwebtoken";


export default {
    Mutation: {
      login: async (_, { username, password }, { client }) => {
        try {
          const user = await client.user.findFirst({ where: { username } });
          if (!user) {
            throw new Error("Username is not found.");
          }
          const auth = await bcrypt.compare(password, user.password);
          if (!auth) {
            throw new Error("Password is not valid.");
          }
          const token = jwt.sign({ id: user.id }, process.env.PRIVATE_KEY);
          return {
            ok: true,
            token: token,
          };
        } catch (error) {
          return {
            ok: false,
            error: `${error}`,
          };
        }
      },
    },
  };