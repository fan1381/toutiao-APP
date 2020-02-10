// 提取的文章列表组件
<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell
        v-for="(article,index) in list"
        :key="index"
        :title="article.title"
        @click="$router.push('/article/' + article.art_id)"
      />
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { getArticle } from '@/api/article.js'
export default {
  name: 'ArticleList',
  components: {},
  props: {
    // 频道对象，父组件提供
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 列表数据
      loading: false, // 上拉加载更多的 loading 状态
      finished: false, // 数据是否加载完毕
      isLoading: false, // 下拉刷新状态
      timestamp: null // 用于获取下一页数据的时间戳
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    // 上划加载 list列表
    async onLoad () {
      // 1请求数据
      const { data } = await getArticle({
        channel_id: this.channel.id, // 频道id
        timestamp: this.timestamp || Date.now(), // 时间戳，新数据传入当前时间戳，旧数据传入历史时间戳
        with_top: 1 // 是否包含置顶,1包含，2no
      })
      // 2加载数据
      const results = data.data.results
      this.list.push(...results) // ...是展开运算符，把里面的数据一个一个的拿出来，以逗号分隔
      // 3 加载状态结束
      this.loading = false
      // 4数据全部加载完成
      if (results.length) {
        this.timestamp = data.data.pre_timestamp // 更新下一页数据的时间戳
      } else {
        this.finished = true // 没有数据了，把这个设置true，不在加载更多
      }
    },
    // 下拉刷新
    async onRefresh () {
      // 1请求数据
      const { data } = await getArticle({
        channel_id: this.channel.id, // 频道id
        timestamp: Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1
      })
      //   2如果有数据，把数据放到最前面
      const { results } = data.data
      this.list.unshift(...results)
      //   3关闭下拉刷新的loading状态
      this.isLoading = false
      // 4提示更新成功
      this.$toast(`更新了${results.length}条数据`)
    }
  }
}
</script>
