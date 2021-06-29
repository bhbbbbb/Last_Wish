export const global_links = [
  {
    text: 'Articles',
    to: {
      name: 'Articles',
    },
    icon: 'mdi-earth',
  },
  {
    text: 'Log in',
    to: {
      name: 'Login',
    },
    icon: 'mdi-login',
  },
  {
    text: 'Register',
    to: {
      name: 'Register',
    },
    icon: 'mdi-account-plus',
  },
];
export const user_links = [
  {
    text: 'global',
    to: {
      name: 'Articles',
    },
    icon: 'mdi-earth',
  },
  {
    text: 'follow',
    to: {
      name: 'FollowArticles',
    },
    icon: 'mdi-bookmark',
  },
  {
    text: 'post',
    to: {
      name: 'NewPost',
    },
    icon: 'mdi-playlist-plus',
  },
  // {
  //   text: '追蹤中',
  //   to: {
  //     name: 'Following',
  //   },
  //   icon: 'mdi-account',
  // },
  {
    text: 'home',
    to: {
      name: 'User',
      params: {
        username: '',
      },
    },
    icon: 'mdi-home',
  },
];
