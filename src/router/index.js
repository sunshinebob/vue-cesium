import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Cesium',

    component: () => import('@/layout/Layout')
  },
  {
    path: '/my',
    name: 'My',

    component: () => import('@/views/myComponent/MyComponent')
  }
]

const router = new VueRouter({
  routes
})

export default router
