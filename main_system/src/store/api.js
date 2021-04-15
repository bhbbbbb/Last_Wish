import axios from 'axios';
// const baseURL = 'http://luffy.ee.ncku.edu.tw:2222';
const baseURL = 'http://localhost:2222';

const articleRequest = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' },
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
})

const userRequest = axios.create({
    baseURL: baseURL + "/user",
    headers: { 'Content-Type': 'application/json' },
})


export const apiGetArticles = () => articleRequest.get('/articles');
export const apiUploadArticle = (data) => articleRequest.post('/articles/insert', data);

export const apiTryLogin = (data) => userRequest.post('/try_login', data);