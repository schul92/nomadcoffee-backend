import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    unfollowUser: protectedResolver(
      async (_, { username }, { client, loggedInUser }) => {
        try {
          const user = await client.user.findUnique({
            where: { username },
          });

          if (!user) {
            throw new Error("Username is not found");
          }

          await client.user.update({
            where: { id: loggedInUser.id },
            data: { following: { disconnect: { username } } },
          });
          return {
            ok: true,
          };
        } catch (err) {
          return {
            ok: false,
            error: `${err}`,
          };
        }
      }
    ),
  },
};