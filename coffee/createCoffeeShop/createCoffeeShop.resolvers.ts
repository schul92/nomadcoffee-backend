
import { protectedResolver } from "../../users/users.utils";
import {
  extractCategories,
  extractFilesUrl,
  filesHandler,
} from "../coffees.utils";
import { createWriteStream } from "fs";

export default {
  Mutation: {
    createCoffeeShop: protectedResolver(
      async (_, { name, files, category }, { client, loggedInUser }) => {
        try {
          let categoryObjs = [];
          let files_url = [];

          if (category) {
            categoryObjs = extractCategories(category);
          }

          if (files) {
            /**
             * Phase 1. Save image to the server by using node.js
             *          writeStream is an example of saving files by using node.js
             * Phase 2. Save image to the AWS and add returned URL to the database
             */
            files_url = await Promise.all(
              files.map((file: any) => filesHandler(file))
            );
          }

          const shop = await client.coffeeShop.create({
            data: {
              user: {
                connect: {
                  id: loggedInUser.id,
                },
              },
              name,
              ...(categoryObjs.length > 0 && {
                categories: {
                  connectOrCreate: categoryObjs,
                },
              }),
            },
          });

          if (!shop) {
            throw new Error("An error occurs on CoffeeShop create.");
          }

          const photo = await Promise.all(
            files_url.map(async (file_url) => {
              await client.coffeeShopPhoto.create({
                data: {
                  url: file_url,
                  shop: {
                    connect: {
                      id: shop.id,
                    },
                  },
                },
              });
            })
          );

          if (!photo) {
            throw new Error("An error occurs on the CoffeeShopPhoto upload.");
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
