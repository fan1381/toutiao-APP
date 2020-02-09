<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        class="search-form"
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="$router.back()"
        @focus="isResultShow=false"
        @input="onSearchInput"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :q='searchText'></search-result>
    <!-- 联想建议 -->
    <van-cell-group v-else-if="searchText">
      <van-cell icon="search" v-for="(item ,index) in Suggestions" :key="index" @click="onShow(item)">
        <div slot="title" v-html="highlight(item)"></div>   <!-- 高亮显示联想建议 -->
      </van-cell>
    </van-cell-group>

    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <van-icon name="delete" />
        <span>全部删除</span>
        &nbsp;&nbsp;
        <span>完成</span>
      </van-cell>
      <van-cell title="历史记录">
        <van-icon name="close"></van-icon>
      </van-cell>
      <van-cell v-for="(item,index) in liShiJiLU" :key="index" :title="item">
        <van-icon name="close"></van-icon>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import searchResult from './components/search-result' // 搜索列表组件
import { getSuggestions } from '@/api/search'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: {
    searchResult
  },
  props: {},
  data () {
    return {
      isResultShow: false, // 搜索结果展示
      searchText: '', // 搜索内容
      Suggestions: [], // 接受联想建议
      liShiJiLU: getItem('liShi') || []// 历史记录
    }
  },
  computed: {},
  watch: {
    liShiJiLU (newVal) {
      setItem('liShi', newVal)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onSearch () {
      this.isResultShow = true
      //   记录历史记录
      const index = this.liShiJiLU.indexOf(this.searchText)
      if (index !== -1) {
        this.liShiJiLU.splice(index, 1)
      }
      this.liShiJiLU.unshift(this.searchText)
    },
    // 搜索联想建议
    async onSearchInput () {
      const searchText = this.searchText
      if (!searchText) {
        return
      }
      const { data } = await getSuggestions(searchText)
      this.Suggestions = data.data.options
    },
    // 联想建议高亮显示
    highlight (str) {
      return str
        .toLowerCase()
        .replace(
          this.searchText.toLowerCase(),
          `<span style='color:red'>${this.searchText}</span>`
        )
    },
    // 点击联想建议搜索
    onShow (item) {
      this.searchText = item // 更新搜索框的数据
      this.isResultShow = true// 展示搜索结果
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 0px;
  // 让搜索栏固定在顶部
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
