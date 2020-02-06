import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import './styles/index.less'
import 'normalize.css'
import 'amfe-flexible' // rem 适配
Vue.config.productionTip = false
Vue.use(Vant)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
