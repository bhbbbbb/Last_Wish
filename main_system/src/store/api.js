import axios from 'axios';
const proURL = 'http://luffy.ee.ncku.edu.tw:2222';
const devURL = '';
// const devURL = 'http://192.168.0.3:2222';

let baseURL = process.env.NODE_ENV === 'development' ? devURL : proURL;

const articleRequest = axios.create({
    baseURL: baseURL + '/articles',
    headers: { 'Content-Type': 'application/json' },
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})

const userRequest = axios.create({
    baseURL: baseURL + '/user',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})

const uploadRequest = axios.create({
    baseURL: baseURL + '/uploads',
    headers: { 'Content-Type': 'multipart/form-data' },
})
/********************** Call upload.js **********************/
export const apiUploadFiles = (data) => uploadRequest.post('/uploadFile',data);


/********************** Call article.js **********************/
export const apiGetArticles = () => articleRequest.get('/');
export const apiUploadArticle = (data) => articleRequest.post('/insert', data);
export const apiUploadComment = (data) =>articleRequest.post('/addcomment',data);
export const apiUserPosts = (data) => articleRequest.post('/user_post',data);
export const apiUserFollowedPosts = () => articleRequest.get('/followed_post');
export const apiUploadMilestone=(data)=>articleRequest.post('/addMilestone',data);



/********************** Call user.js **********************/
export const apiGetUserId = (data) => userRequest.post('/get_id_by_name',data);
export const apiTryLogin = (data) => userRequest.post('/try_login', data);
export const apiRegister = (data) =>userRequest.post('/register',data);
export const apiWho = () => userRequest.get('/who');
export const apiLogout = () => userRequest.get('/logout'); // clear the session on server


/**
 * 
 * @param {Number} id 
 * @returns {Object} id and username
 */
export const apiGetPublicInfo = (id) => userRequest.get('get_public_info', {params: {id: id}});

export const apiLineLogin = (data) => userRequest.post('/line_login_req', data);


