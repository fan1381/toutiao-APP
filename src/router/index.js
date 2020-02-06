// 配置路由
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login' // 引入登录页面

Vue.use(VueRouter)

const routes = [{
  path: '/login', // 登录页面
  component: Login
}]

const router = new VueRouter({
  routes
})

export default router
