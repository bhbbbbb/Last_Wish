import axios from 'axios';
const proURL = 'https://luffy.ee.ncku.edu.tw:2222';
const devURL = '';
// const devURL = 'http://192.168.0.3:2222';

export const baseURL = process.env.NODE_ENV === 'development' ? devURL : proURL;

const articleRequest = axios.create({
  baseURL: baseURL + '/articles',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

const userRequest = axios.create({
  baseURL: baseURL + '/user',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const uploadRequest = axios.create({
  baseURL: baseURL + '/uploads',
  withCredentials: true,
  headers: { 'Content-Type': 'multipart/form-data' },
});
/********************** Call upload.js **********************/
export const apiUploadFiles = (data) => uploadRequest.post('/uploadFile', data);

/********************** Call article.js **********************/
export const apiGetArticles = () => articleRequest.get('/');
export const apiUploadArticle = (data) => articleRequest.post('/insert', data);
export const apiUploadComment = (data) =>
  articleRequest.post('/addcomment', data);
export const apiGetUserPosts = (user_id) =>
  articleRequest.get('/get_user_posts', { params: { user_id } });

export const apiGetFollowedPosts = () =>
  articleRequest.get('/get_followed_posts');
// export const apiUploadMilestone = (data) =>
//   articleRequest.post('/addMilestone', data);

export const apiUpdateArticle = (data) =>
  articleRequest.post('/editArticle', data);

export const apiGetArticleById = (id) =>
  articleRequest.get('/get_article_by_id', { params: { article_id: id } });

/********************** Call user.js **********************/
export const apiGetUserId = (name) =>
  userRequest.get('/get_id_by_name', { params: { name } });
export const apiTryLogin = (data) => userRequest.post('/try_login', data);
export const apiRegister = (data) => userRequest.post('/register', data);
export const apiWho = () => userRequest.get('/who');
export const apiLogout = () => userRequest.get('/logout'); // clear the session on server
export const apiSetProPic = (data) => userRequest.post('/set_pro_pic', data);
export const apiSendTokenMail = (data) =>
  userRequest.get('/send_token_mail', { params: { username: data } });

/**
 *
 * @param {String} id
 */
export const apiToggleFollow = (id) =>
  userRequest.post('/toggle_followed_post', { article_id: id });

/**
 *
 * @param {String} username
 * @returns
 */
export const apiIsValid = (data) =>
  userRequest.get('/is_valid_username', { params: { username: data } });

/**
 *
 * @param {Number} id
 * @returns {Object} id and username
 */
export const apiGetPublicInfo = (id) =>
  userRequest.get('get_public_info', { params: { id: id } });

export const apiLineLogin = (data) => userRequest.post('/line_login_req', data);
