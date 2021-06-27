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

/********************** Call #article.js **********************/

//--------------------- get #articles --------------------------
export const apiGetArticles = (sort_by, filter) =>
  articleRequest.get('/', { params: { sort_by, filter } });

export const apiGetFollowedPosts = (sort_by, filter) =>
  articleRequest.get('/get_followed_posts', { params: { sort_by, filter } });

export const apiGetUserPosts = (user_id, sort_by, filter) =>
  articleRequest.get('/get_user_posts', {
    params: { user_id, sort_by, filter },
  });

export const apiGetArticleById = (id) =>
  articleRequest.get('/get_article_by_id', { params: { article_id: id } });

export const apiGetLikedPost = () => userRequest.get('/get_liked_posts');

// ----------------------------------------------------------------

export const apiUploadArticle = (data) => articleRequest.post('/insert', data);

/**
 *
 * @param {String} article_id
 * @param {String} comment
 * @returns
 */
export const apiAddComment = (article_id, comment) =>
  articleRequest.post('/add_comment', { article_id, comment });

export const apiEditArticle = (id, new_article) =>
  articleRequest.post('/edit_article', {
    article_id: id,
    new_article,
  });

export const apiDeleteArticle = (id) =>
  articleRequest.post('/delete', { article_id: id });

/********************** milestone #milestone #ms  ********************/

// export const apiToggleMsFinished = (article_id, milestone_id) =>
//   articleRequest.post('/toggle_finished_milestone', {
//     article_id,
//     milestone_id,
//   });

export const apiEditMilestone = (article_id, milestone_id, new_milestone) =>
  articleRequest.post('/edit_milestone', {
    article_id,
    milestone_id,
    new_milestone,
  });

export const apiAddMilestone = (article_id, milestone) =>
  articleRequest.post('/add_milestone', { article_id, milestone });

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
 * @param {obj} self_intro : (String)
 * @returns
 */

export const apiSetSelfIntro = (data) =>
  userRequest.post('/set_self_intro', data);

/**
 *
 * @param {String} id
 * @param {Boolean} set
 */
export const apiSetFollow = (id, set) =>
  userRequest.post('/set_followed_post', { article_id: id, set });

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
 * @param {Boolean} set
 */
export const apiSetLike = (article_id, set) =>
  userRequest.post('/set_liked_post', { article_id, set });

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

export const apiEditEvent = (event_id, event) =>
  userRequest.post('/edit_event_by_id', {
    event_id,
    name: event.name,
    color: event.color,
    start: event.start,
    end: event.end,
    finished: event.finished,
  });
