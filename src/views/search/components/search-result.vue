// 搜索结果
<template>
  <div class="search-result">
   <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
  <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
</van-list>
  </div>
</template>

<script>
import { getSearch } from '@/api/search' // 搜索结果接口
export default {
  name: 'SearchResult',
  components: {},
  props: {
    q: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10

    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
    //   1请求数据
      const { data } = await getSearch({
        page: this.page, // 页码
        per_page: this.perPage, // 每页大小
        q: this.q// 搜索关键字
      })
      //   2将数据加到列表中
      //   this.list = data.data.results
      const { results } = data.data
      this.list.push(...results)
      this.loading = false // 3加载状态结束
      // 4 数据全部加载完成
      if (results.length) { // 如果还有数据，更新下一页的数据
        this.page++
      } else { // 没有数据了，就将加载状态设置结束，不在onload
        this.finished = false
      }
    }
  }
}
</script>

<style scoped></style>
