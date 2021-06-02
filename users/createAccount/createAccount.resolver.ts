import * as bcrypt from "bcrypt";
export default {
    Mutation: {
      createAccount: async (_, { username, email, password }, { client }) => {
        try {
          const check = await client.user.findFirst({
            where: { OR: [{ username }, { email }] },
          });
          if (check) {
            throw new Error("This username or email is already taken.");
          }
          const hashPassword = await bcrypt.hash(password, 10);
          await client.user.create({
            data: {
              username,
              email,
              password: hashPassword,
            },
          });
          return {
            ok: true,
          };
        } catch (e) {
          return {
            ok: false,
            error: `${e}`,
          };
        }
      },
    },
  };
  