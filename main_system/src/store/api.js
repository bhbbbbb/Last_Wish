import axios from 'axios';
const proURL = 'http://luffy.ee.ncku.edu.tw:2222';
const devURL = 'http://localhost:2222';

let baseURL = process.env.NODE_ENV === 'development' ? devURL : proURL;

const articleRequest = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})

const userRequest = axios.create({
    baseURL: baseURL + "/user",
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
})


export const apiGetArticles = () => articleRequest.get('/articles');
export const apiUploadArticle = (data) => articleRequest.post('/articles/insert', data);

export const apiTryLogin = (data) => userRequest.post('/try_login', data);
export const apiWho = () => userRequest.get('/who');
export const apiLogout = () => userRequest.get('/logout'); // clear the session on server

/**
 * 
 * @param {Number} id 
 * @returns {Object} id and username
 */
export const apiGetPublicInfo = (id) => userRequest.get('get_public_info', {params: {id: id}});

export const apiLineLogin = (data) => userRequest.post('/line_login_req', data);