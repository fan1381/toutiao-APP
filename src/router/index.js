// 配置路由
import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '@/views/login' // 引入登录页面

Vue.use(VueRouter)

const routes = [{
  path: '/login', // 登录页面
  name: 'login',
  component: () =>
        import ('@/views/login')
}, {
  path: '/',
  name: 'tab-var',
  component: () =>
        import ('@/views/tab-bar'),
  // 二级路由
  children: [{
    path: '', // 默认子路由
    name: 'home',
    component: () =>
                import ('@/views/home')
  },
  {
    path: 'qa',
    name: 'qa',
    component: () =>
                import ('@/views/qa')
  },
  {
    path: 'video',
    name: 'video',
    component: () =>
                import ('@/views/video')
  },
  {
    path: 'my',
    name: 'my',
    component: () =>
                import ('@/views/my')
  }
  ]
}, {
  path: '/search', // 搜索
  component: () =>
        import ('@/views/search')
}, {
  path: '/article/:articleId',
  name: 'article',
  component: () =>
        import ('@/views/article'),
  // 将路由动态参数映射到组件的 props 中，更推荐这种做法
  props: true
}]

const router = new VueRouter({
  routes
})

export default router
