const devUrl = '';
const proUrl = 'https://luffy.ee.ncku.edu.tw:2222';
module.exports = {
  backendUrl: process.env.NODE_ENV !== 'production' ? devUrl : proUrl,
  imageUrl: proUrl,
};
