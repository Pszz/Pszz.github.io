import Vue from 'vue'
import Router from 'vue-router'
import Index from 'components/Index'
import Main from 'components/Main'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/main',
      name: 'Main',
      component: Main
    }
  ]
})
