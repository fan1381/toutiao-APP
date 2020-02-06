import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import './styles/index.less'
import './styles/base.less' // 公共样式
import 'normalize.css'
import 'amfe-flexible' // rem 适配
import './utils/register-vant' // 加载注册vant组件
Vue.config.productionTip = false
Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
