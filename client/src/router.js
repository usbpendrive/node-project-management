import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Signup from './views/Signup'
import Login from './views/Login'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { title: 'Enamel' }
    },
    {
      path: '/signup/:id',
      name: 'signup',
      component: Signup,
      meta: { title: 'Signup - enamel' }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: 'Login - enamel' }
    }
  ]
})

router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
