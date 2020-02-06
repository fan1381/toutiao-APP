<template class=''>
  <div class="van-nav-bar">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />

    <!-- 表单 -->
    <van-cell-group>
      <van-field v-model="user.mobile" required clearable label="手机号" placeholder="请输入手机号"/>
      <van-field v-model="user.code" required label="验证码" placeholder="请输入验证码">
      <van-button slot="button" size='small' type='primary'>发送验证码</van-button>
      </van-field>
    </van-cell-group>

    <!-- 登录按钮 -->
    <div class="btn-wrap">
      <van-button @click="onLogin" type="info">登录</van-button>
    </div>

  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
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
    }
    // onLogin () {
    //   const user = this.user

    //   login(user).then(
    //     console.log('s')

    //   )
    // }
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
