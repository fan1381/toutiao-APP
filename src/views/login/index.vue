<template class=''>
  <div class="van-nav-bar">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />

    <!-- 表单 -->
    <van-cell-group>
      <van-field v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号"/>
      <van-field v-model="user.code" required label="验证码" placeholder="请输入验证码">
     <van-count-down v-if="codeShow" slot="button"  format=" ss 秒" :time="60*1000" />
      <van-button v-else @click="onCode" slot="button" size='small' type='primary'>发送验证码</van-button>
      </van-field>
    </van-cell-group>

    <!-- 登录按钮 -->
    <div class="btn-wrap">
      <van-button @click="onLogin" type="info">登录</van-button>
    </div>

  </div>
</template>

<script>
import { login, code } from '@/api/user'
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
    // 登录
    async onLogin () {
      // 获取表单数据
      const user = this.user
      // 验证表单
      this.$toast.loading({
        message: '登录中...'
      })
      // 请求提交
      try {
        const res = await login(user)
        console.log(res)
        this.$toast.message('登录成功')
      } catch (err) {
        this.$toast.fail('登录失败')
      }
    },
    // 发送验证码
    async onCode () {
      const { mobile } = this.user
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
.btn-wrap{
    padding: 27px 17px;
    .van-button{
        width: 100%;
    }
}

</style>
