// linking.ts
const linking = {
  prefixes: ['hubble-meet-mobile://'],
  config: {
    screens: {
      profile: {
        path: 'profile',
        parse: {
          user_id: (user_id: string) => `${user_id}`,
        },
      },
    },
  },
};

export default linking;