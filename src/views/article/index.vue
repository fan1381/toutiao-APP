<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar title="文章详情" left-arrow fixed @click-left="$router.back()"></van-nav-bar>

    <!-- 加载中 -->
    <van-loading v-if="loading" class="loading" color="#1989fa" vertical>
      <slot>加载中...</slot>
    </van-loading>

    <!-- 文章详情 -->
    <div v-else-if="article.title" class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author-wrap">
        <div class="base-info">
          <van-image class="avatar" round fit="cover" :src="article.aut_photo" />
          <div class="text">
            <p class="name">{{article.aut_name}}</p>
            <p class="time">{{article.pubdate |relativeTime}}</p>
          </div>
        </div>
        <van-button
          @click="onFollow"
          v-if="$store.state.user||article.aut_id!==$store.state.user.id"
          class="follow-btn"
          type="info"
          size="small"
          round
          :loading="isFollowLoading"
        >{{ article.is_followed?'已关注':'关注' }}</van-button>
      </div>
      <div class="markdown-body" v-html="article.content"></div>
      <van-divider>正文结束</van-divider>
      <van-cell title="全部评论 " :border="false"></van-cell>
      <!-- 文章评论 -->
      <van-list
        v-model="articleComment.loading"
        :finished="articleComment.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 评论组件 -->
        <ArticleItem
          v-for="(comment,index) in articleComment.list"
          :key="index"
          :comment="comment"
          @click-reply="onReplyShow"
        />
      </van-list>
    </div>

    <!-- 加载失败提示 -->
    <div v-else class="error">
      <img src="./no-network.png" alt="no-network" />
      <p class="text">亲，网络不给力哦~</p>
      <van-button class="btn" type="default" size="small">点击重试</van-button>
    </div>

    <!-- 底部区域 -->
    <div class="footer">
      <van-button class="write-btn" type="default" round size="small" @click="isPostShow = true">写评论</van-button>
      <van-icon class="comment-icon" name="comment-o" :info="articleComment.totalCount" />
      <!-- 根据接口里的数据来判断收藏状态，来显示实心还是空心图标 -->
      <van-icon color="orange" :name="article.is_collected?'star':'star-o'" @click="onCollect" />
      <van-icon
        color="#e5645f"
        :name="article.attitude===1?'good-job':'good-job-o'"
        @click="onLike"
      />
      <van-icon class="share-icon" name="share" />
    </div>
    <!-- 发布文章评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <div class="post-button">
        <van-field
          class="post-field"
          v-model="postMessage"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
        />
        <van-button @click="onAddComment" size="small" type="primary">发布</van-button>
      </div>
    </van-popup>
    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height:90%">
      <!-- 回复评论组件 -->
<commentReply v-if="isReplyShow" :article-id='articleId' @click-close='isReplyShow=false' :comment='currentComment'>

</commentReply>
    </van-popup>
  </div>
</template>

<script>
import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'
import { addFollow, deleteFollow } from '@/api/user' // 关注用户
import { getComments, addComment } from '@/api/comment.js' // 评论
import ArticleItem from './components/comment-item'
import commentReply from './components/comment-reply'

export default {
  name: 'ArticlePage',
  components: {
    ArticleItem,
    commentReply
  },
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章详情
      loading: true,
      isFollowLoading: false, // 关注的loading
      // 评论相关数据
      articleComment: {
        loading: false, // 评论的加载loading
        list: [], // 评论列表
        finished: false, // 评论是否加载结束
        offset: null, // 请求下一页数据的页码
        totalCount: 0 // 总数据条数
      },
      isPostShow: false, // 发布评论的显示状态
      postMessage: '', // 输入框内容
      isReplyShow: false, // 评论回复弹层
      currentComment: {}// 点击回复评论的值
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getArticle()
    this.onLoad()
  },
  mounted () {},
  methods: {
    // 获取文章详情
    async getArticle () {
      try {
        this.loading = true
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    // 添加取消收藏文章
    async onCollect () {
      // 加载loading状态，并禁止背景点击，防止网络慢时，用户频繁点击
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      // 判断是否收藏
      try {
        if (this.article.is_collected) {
          // 取消收藏
          await deleteCollect(this.articleId)
          this.article.is_collected = false
          this.$toast.success('已取消收藏')
        } else {
          // 收藏
          await addCollect(this.articleId)
          this.article.is_collected = true
          this.$toast.success('收藏成功')
        }
      } catch (err) {
        // console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    // 添加取消点赞
    async onLike () {
      // 加载loading状态，并禁止背景点击，防止网络慢时，用户频繁点击
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      // 判断是否收藏
      try {
        if (this.article.attitude === 1) {
          // 取消收藏
          await deleteLike(this.articleId)
          this.article.attitude = -1
          this.$toast.success('已取消点赞')
        } else {
          // 收藏
          await addLike(this.articleId)
          this.article.attitude = 1
          this.$toast.success('点赞成功')
        }
      } catch (err) {
        // console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    // 关注用户
    async onFollow () {
      this.isFollowLoading = true // 关注的loading先转着
      try {
        // 判断是否关注,已关注择取消关注
        const authorId = this.article.aut_id
        if (this.article.is_followed) {
          // 取消关注
          await deleteFollow(authorId)
        } else {
          // 关注
          await addFollow(authorId)
        }
        this.article.is_followed = !this.article.is_followed // 更新视图
      } catch (err) {
        this.$toast.fail('操作失败')
      }
      this.isFollowLoading = false // 关闭关注的loading
    },
    // 评论模块显示
    async onLoad () {
      const articleComment = this.articleComment
      //   请求数据
      const { data } = await getComments({
        type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.articleId, // 源id，文章id或评论id
        offset: articleComment.offset, // 获取评论数据的偏移量，值为评论id，
        // 表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: 10 // 每页大小
      })
      //   赋值
      const { results } = data.data
      articleComment.list.push(...results)
      articleComment.totalCount = data.data.total_count // 更新总条数
      articleComment.loading = false // 将加载更多loading关闭

      //  判断是否还有数据
      if (results.length) {
        articleComment.offset = data.data.last_id // 更新获取下一页数据的页码
      } else {
        articleComment.finished = true // 没有数据了，关闭加载更多
      }
    },
    // 发布评论
    async onAddComment () {
      const postMessage = this.postMessage
      // 非空判断
      if (!postMessage.length) {
        return
      }
      try {
        const { data } = await addComment({
          target: this.$route.params.articleId, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: postMessage // 评论内容
          // art_id // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        this.isPostShow = false // 关闭弹层
        this.articleComment.list.unshift(data.data.new_obj) // 将发布的文章添加到顶部
        this.articleComment.totalCount++ //
        this.$toast.fail('发布成功')
        this.postMessage = '' // 清空输入框文本
      } catch (err) {
        this.$toast.fail('发布失败')
      }
    },
    // 打开回复弹层
    async onReplyShow (comment) {
      this.currentComment = comment// 从item组件传值过来，这个接受，再发给reply
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  padding: 46px 20px 150px;
  background: #fff;
  .loading {
    padding-top: 100px;
    text-align: center;
  }
  .detail {
    .title {
      margin: 0;
      padding-top: 24px;
      font-size: 20px;
      color: #3a3a3a;
    }
    .author-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      height: 40px;
      .base-info {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          margin-right: 8px;
        }
        .text {
          line-height: 1.5;
          .name {
            margin: 0;
            font-size: 14px;
          }
          .time {
            margin: 0;
            font-size: 12px;
            color: #999;
          }
        }
      }
      .follow-btn {
        width: 85px;
      }
    }
  }
  .error {
    padding-top: 100px;
    text-align: center;
    .text {
      font-size: 15px;
    }
    .btn {
      width: 30%;
    }
  }
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
    .comment-icon {
      bottom: -2px;
    }
    .share-icon {
      bottom: -2px;
    }
  }
}
.post-button {
  display: flex;
  align-items: flex-end;
  padding: 10px;
  .post-field {
    background: #f5f7f9;
    margin-right: 15px;
  }
}
</style>
