module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: 'http://localhost:2222',
  },
  transpileDependencies: ['vuetify'],
  productionSourceMap: false,
  pwa: {
    name: 'Lernen',
    // appleMobileWebAppStatusBarStyle: 'black-translucent',
  },
};
