import axios from 'axios';
const serURL = 'http://luffy.ee.ncku.edu.tw:2222';
// const baseURL = 'localhost:2222';

const articleRequest = axios.create({
    baseURL: serURL,
    headers: { 'Content-Type': 'application/json' },
})

export const apiGetArticles = () => articleRequest.get('about_me.json');