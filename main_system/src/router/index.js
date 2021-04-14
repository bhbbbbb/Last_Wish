import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/home/articles',
    children: [
      {
        path: 'articles',
        name: 'ArticleContainer',
        component: () => import('@/views/Home/ArticleContainer')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Home/Register')
      }]
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/User')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
