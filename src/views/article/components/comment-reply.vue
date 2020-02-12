<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条评论`">
      <van-icon
        slot="left"
        name="cross"
      />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论项 -->
<ArticleItem :comment='comment'></ArticleItem>
    <!-- /当前评论项 -->

    <van-cell title="所有回复" />

    <!-- 评论的回复列表 -->
        <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <ArticleItem
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
      />
    </van-list>
    <!-- /评论的回复列表 -->

    <!-- 底部 -->
    <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
    </div>
    <!-- /底部 -->
    <!-- 发布回复 -->
    <van-popup v-model="isPostShow" position="bottom">
  <post-comment v-model="poatMessage" @click-post='onPost'></post-comment>
    </van-popup>

  </div>
</template>

<script>
import ArticleItem from './comment-item'
import { getComments } from '@/api/comment'
import postComment from './post-comment'
import { addComment } from '@/api/comment.js' // 评论

export default {
  name: 'CommentReply',
  components: {
    ArticleItem,
    postComment
  },
  props: {
    comment: {// item组件传给index组件，又传过来的值
      type: Object,
      required: true
    },
    ArticleId: {
      type: [Object, Number, String]
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 20,
      isPostShow: false, // 发布回复
      poatMessage: ''
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {},
  methods: {
    async onLoad () {
      // 请求数据
      const { data } = await getComments({
        type: 'c', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.comment.com_id.toString(), // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      })
      // 添加数据
      const { results } = data.data
      this.list.push(...results)
      this.loading = false// 关闭loading
      // 判断是否加载完毕
      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    },
    async onPost () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '发布中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        const { data } = await addComment({
          target: this.comment.com_id.toString(),
          content: this.postMessage, // 评论内容
          art_id: this.articleId// 文章id
        })
        this.postMessage = '' // 清空文本框
        this.isPostShow = false// 关闭弹层
        this.list.unshift(data.data.new_obj)// 将数据添加到列表顶部
        this.comment.reply_count++ // 更新回复的总数量
        this.$toast.success('发布成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('发布失败')
      }
    }
  }
}
</script>
<style scoped lang="less">
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .write-btn {
    width: 160px;
  }
  .van-icon {
    font-size: 20px;
  }
}
</style>
