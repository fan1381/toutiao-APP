<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条评论`">
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('click-close')"
      />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论项 -->
<ArticleItem :comment='comment'></ArticleItem>
    <!-- /当前评论项 -->

    <van-cell title="所有回复" />

    <!-- 评论的回复列表 -->
    <!-- /评论的回复列表 -->

    <!-- 底部 -->
    <!-- /底部 -->
  </div>
</template>

<script>
import ArticleItem from './comment-item'

export default {
  name: 'CommentReply',
  components: {
    ArticleItem
  },
  props: {
    comment: {// item组件传给index组件，又传过来的值
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {},
  methods: {}
}
</script>

<style scoped></style>
