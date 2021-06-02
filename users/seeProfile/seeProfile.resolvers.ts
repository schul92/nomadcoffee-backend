export default {
    seeProfile: (_, { username }, { client }) =>
    client.user.findUnique({
        where: { username },
      }),
  }