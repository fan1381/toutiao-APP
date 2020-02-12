<template>
  <div>
    <van-nav-bar title="编辑昵称" left-text="取消" right-text="确定" />
    <van-field
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="10"
      placeholder="请输入昵称"
      show-word-limit
    />
  </div>
</template>
<script>
export default {
  name: 'EditNmae',
  comments: {},
  props: {},
  data () {
    return {
      message: ''
    }
  }

}
</script>
<style scoped lang='less'>
.van-nav-bar {
  background-color: #fff;
  .van-nav-bar__title {
    color: #333;
  }
}
</style>
