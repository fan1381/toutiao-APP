<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar title="首页" fixed />
    <!-- 弹出层 -->
    <van-popup v-model="isChannelEditShow" position="bottom" closeable :style="{ height: '100%' }">
      <!-- 编辑频道组件 -->
      <channel-edit v-model='active' :user-channels="userChannels" @close='isChannelEditShow=false'/>
    </van-popup>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-icon class="wap-nav" slot="nav-right" name="wap-nav" @click="isChannelEditShow = true" />
      <van-tab :title="channel.name" v-for="channel in userChannels" :key="channel.id">
        <articleList :channel="channel"></articleList>
        <!-- 组件传值 -->
      </van-tab>
    </van-tabs>
    <!-- /频道列表 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import articleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomePage',
  components: {
    articleList, // 注册文章列表组价
    ChannelEdit // 注册编辑组件
  },
  props: {},
  data () {
    return {
      active: 0, // 控制标签页的激活项，用v-model绑定
      userChannels: [], // 用户频道列表
      isChannelEditShow: false // 这里我们先设置为 true 就能看到弹窗的页面了
    }
  },
  computed: {},
  watch: {

  },
  created () {
    this.loadUserChannels()
  },
  mounted () {},
  methods: {
    // 加载频道列表
    async loadUserChannels () {
      // 1先储存频道列表
      let channels = []
      // 2获取本地存储的频道列表
      const localUserChannels = getItem()
      // 3优先使用本地的，没有就使用线上的
      if (localUserChannels) {
        channels = localUserChannels
      } else {
        const { data } = await getUserChannels()
        channels = data.data.channels
      }
      // 最后把数据赋值到当前组件中
      this.userChannels = channels
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 90px; //给页面容器添加上下内边距
  padding-bottom: 50px;
  .wap-nav {
    position: fixed;
    right: 0;
    line-height: 44px;
    background-color: #fff;
  }
  /deep/ .van-tabs__wrap {
    //让频道列表固定定位
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
