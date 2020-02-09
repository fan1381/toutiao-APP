<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <van-button size="mini" round type="danger" plain   @click="isEditShow = !isEditShow"
>{{ isEditShow ? '完成' : '编辑'}}</van-button>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item v-for="item in userChannels" :key="item.id" :text="item.name" >
              <van-icon v-show="isEditShow" slot="icon" name="close" />
 </van-grid-item>
    </van-grid>

    <van-cell title="推荐频道" :border="false" />
    <van-grid :gutter="10">
      <van-grid-item v-for="channel in remainingChannels" :key="channel.id"
      :text="channel.name"
      @click="onAdd(channel)" />
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
      allChannels: [], // 所有频道
      isEditShow: true
    }
  },
  computed: {
    // 计算熟悉获取推荐频道
    remainingChannels () {
      // const { allChannels, userChannels } = this
      // 剩余频道 = 所有频道 - 我的频道
      const userChannels = this.userChannels
      const allChannels = this.allChannels
      const channels = []

      allChannels.forEach(item => {
        // 遍历所有频道
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
    },
    // 添加频道
    onAdd (channel) {
      this.userChannels.push(channel)
    }
  }
}
</script>

<style scoped lang=less>
.channel-edit {
  padding: 40px 0;
};
/deep/ .van-grid-item__icon-wrapper {
  position: absolute;
  top: -14px;
  right: -5px;
  .van-icon-close {
    font-size: 14px;
  }
}

</style>
