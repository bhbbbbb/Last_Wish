import axios from 'axios';
import config from '../../config';
// export const baseURL = process.env.NODE_ENV === 'development' ? devURL : proURL;
export const baseURL = config.backendUrl;

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
export const apiGetArticles = () =>
  articleRequest.get('/', { params: { new2old: true } });
export const apiUploadArticle = (data) => articleRequest.post('/insert', data);

/**
 *
 * @param {String} article_id
 * @param {String} comment
 * @returns
 */
export const apiAddComment = (article_id, comment) =>
  articleRequest.post('/add_comment', { article_id, comment });

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
  userRequest.get('/get_public_info', { params: { id: id } });

export const apiLineLogin = (data) => userRequest.post('/line_login_req', data);

/**
 *
 * @param {String} article_id
 */
export const apiToggleLike = (article_id) =>
  userRequest.post('/toggle_liked_post', { article_id });

export const apiGetLikedPost = () => userRequest.get('/get_liked_posts');

/**
 *
 * @param {String} username
 * @param {String} new_pass
 */
export const apiReset = (username, new_pass) =>
  userRequest.post('/reset_pass', { username, new_pass });

// ----------------- event -------------------------

export const apiGetEvents = () => userRequest.get('/get_events');

export const apiAddEvent = (event) =>
  userRequest.post('/add_event_to_user', event);
