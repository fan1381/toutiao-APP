<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <van-button size="mini" round type="danger" plain>编辑</van-button>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
       v-for="item in userChannels"
        :key="item.id"
        :text="item.name"
      />
    </van-grid>

    <van-cell title="推荐频道" :border="false" />
<van-grid :gutter="10">
  <van-grid-item
    v-for="channel in remainingChannels"
    :key="channel.id"
    :text="channel.name"
  />
</van-grid>

  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    //   我的频道的接受的值
    userChannels: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      allChannels: []// 所有频道
    }
  },
  computed: {
    remainingChannels () {
      // const { allChannels, userChannels } = this
      // 剩余频道 = 所有频道 - 我的频道
      const userChannels = this.userChannels
      const allChannels = this.allChannels
      const channels = []

      allChannels.forEach(item => { // 遍历所有频道
      // 如果我的频道中不包含当前被遍历的频道，则要
        if (!userChannels.find(items => items.id === item.id)) {
          channels.push(item)
        }
      })
      return channels // 这个就是剩余的频道了
    }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    //   获取所有的频道
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    }
  }
}
</script>

<style scoped>
.channel-edit {
  padding: 40px 0;
}
</style>
