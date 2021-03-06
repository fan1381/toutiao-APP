// Vuex容器
// 1，储存token
import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
import decodeJwt from 'jwt-decode' // 解析token

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录用户，一个对象，包含 token 信息, null里面是token，refresh_token,用户信息等
    user: getItem('user') // vuex里面存的是对象
  },
  mutations: {
    setUser (state, data) {
      if (data && data.token) { // 如果data有效并且有token，再去解析
        data.id = decodeJwt(data.token).user_id
      }
      state.user = data
      // 为了防止数据丢失，还要把数据放到本地储存持久化
      setItem('user', state.user) // 本地储存存的要是字符串
    }
  },
  actions: {},
  modules: {}
})
