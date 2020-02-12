<template>
  <div>
    <van-nav-bar
      title="编辑昵称"
      left-text="取消"
      right-text="确定"
      @click-left="$emit('close')"
      @click-right="$emit('confirm',message)"

    />
    <van-field
      @input="message=$event"
      rows="2"
      autosize
      type="textarea"
      maxlength="10"
      placeholder="请输入昵称"
      show-word-limit
      :value="name"
    />
  </div>
</template>
<script>
export default {
  name: 'EditNmae',
  comments: {},

  props: {
    name: {
      type: String,
      required: ''
    }
  },
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
