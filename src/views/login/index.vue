<template class=''>
  <div class="van-nav-bar">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />

    <!-- 表单 -->
    <ValidationObserver ref="form">     <!-- 包裹整个表单 -->
      <ValidationProvider name='手机号' rules='required|mobile'>    <!-- 包裹具体元素和校验规则 -->
        <van-field v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号" />
      </ValidationProvider>

      <ValidationProvider name='验证码' rules='required|code'>
        <van-field v-model="user.code" required label="验证码" placeholder="请输入验证码">
          <van-count-down v-if="codeShow" slot="button" format=" ss 秒" :time="60*1000" />
          <van-button v-else @click="onCode" slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>
      </ValidationProvider>
    </ValidationObserver>

    <!-- 登录按钮 -->
    <div class="btn-wrap">
      <van-button @click="onLogin" type="info">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login, code } from '@/api/user'
import { validate } from 'vee-validate'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      codeShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  methods: {
    // 点击登录
    async onLogin () {
      const user = this.user // 获取表单数据
      // 验证表单
      const success = await this.$refs.form.validate() // 错误提示消息
      if (!success) {
        setTimeout(() => {
          const errors = this.$refs.form.errors
          const item = Object.values(errors).find(item => {
            return item[0]
          })
          this.$toast(item[0])
        }, 100)
        return
      }
      this.$toast.loading({
        message: '登录中...'
      })
      // 请求提交
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data) // 将登陆状态存储到vuex容器中
        // res.data.data => { token: 'xxx', refresh_token: 'xxx' }
        this.$toast.success('登录成功')
        // 如果有 redirect 则跳转到来源页，没有就跳转到首页
        const redirect = this.$route.query.redirect || '/'
        // 登录成功，使用 replace 跳转（不会形成历史记录）
        this.$router.replace(redirect)
      } catch (err) {
        this.$toast.fail('登录失败')
      }
    },

    // 点击发送验证码
    async onCode () {
      const { mobile } = this.user
      // 验证手机号是否有效
      const validateResult = await validate(mobile, 'required|mobile', {
        name: '手机号'
      })
      if (!validateResult.valid) { // valid: 验证是否成功，成功 true，失败 false
        this.$toast(validateResult.errors[0])
        return
      }
      try {
        this.codeShow = true // 验证码倒计时
        await code(mobile)
        this.$toast('发送成功，请注意查收 ')
      } catch (err) {
        this.codeShow = false // 发送失败关闭倒计时
        if (err.response.status === 429) {
          this.$toast('请勿频繁发送')
          return
        }
        this.$toast('发送失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
.btn-wrap {
  padding: 27px 17px;
  .van-button {
    width: 100%;
  }
}
</style>
