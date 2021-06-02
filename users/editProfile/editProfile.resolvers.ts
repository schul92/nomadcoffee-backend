
import { protectedResolver } from "../users.utils";
import { createWriteStream } from "fs";
import * as bcrypt from "bcryptjs";
import { filesHandler } from "../../coffees/coffees.utils";

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          name,
          location,
          email,
          password: newPassword,
          avatar_url,
          github_username,
        },
        { loggedInUser, client }
      ) => {
        try {
          if (avatar_url) {
            /**
             * Phase 1. Save image to the server by using node.js
             *          writeStream is an example of saving files by using node.js
             * Phase 2. Save image to the AWS and add returned URL to the database
             */
            avatar_url = await filesHandler(avatar_url);
          }

          let hashPassword = null;

          if (newPassword) {
            hashPassword = await bcrypt.hash(newPassword, 10);
          }

          const updatedUser = await client.user.update({
            where: { id: loggedInUser.id },
            data: {
              name,
              location,
              email,
              github_username,
              ...(hashPassword && { password: hashPassword }),
              ...(avatar_url && { avatar_url }),
            },
          });

          if (!updatedUser) {
            throw new Error(
              `Cannot update ${loggedInUser.username}'s, profile`
            );
          }

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