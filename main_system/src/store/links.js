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
        icon: 'mdi-login'
    },
    {
        text: 'Register',
        to: {
            name: 'Register',
        },
        icon: 'mdi-account-plus'
    },
];
export const user_links = [
    {
        text: '世界文章',
        to: {
            name: 'Articles',
            
        },
        icon: 'mdi-earth',
    },
    // {
    //     text: '我的追蹤',
    //     to: {
    //         name: 'Register'
    //     },
    //     icon: 'mdi-account-multiple'
    // },
    {
        text: '個人頁',
        to: {
            name: 'User',
            params: {
                username: '',
            }
        },
        icon: 'mdi-account'
    },
];

