<template class=''>
  <div class="van-nav-bar">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />

    <!-- 表单 -->
    <van-cell-group>
      <van-field required clearable label="手机号" placeholder="请输入手机号">

      </van-field>
      <van-field required label="验证码" placeholder="请输入验证码">
      <van-button slot="button" size='small' type='primary'>发送验证码</van-button>
      </van-field>
    </van-cell-group>

    <!-- 登录按钮 -->
    <div class="btn-wrap">
      <van-button type="info">登录</van-button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  methods: {}
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
