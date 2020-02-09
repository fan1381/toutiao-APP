<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <van-button
        size="mini"
        round
        type="danger"
        plain
        @click="isEditShow = !isEditShow"
      >{{ isEditShow ? '完成' : '编辑'}}</van-button>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item v-for="(item,index) in userChannels" :key="item.id" :text="item.name" @click="userChannel(index)">
        <span slot="text" class="txt" :class="{active:value===index}">{{ item.name }}</span>
        <van-icon v-show="isEditShow && index !==0" slot="icon" name="close" />
      </van-grid-item>
    </van-grid>

    <van-cell title="推荐频道" :border="false" />
    <van-grid :gutter="10">
      <van-grid-item
        v-for="channel in remainingChannels"
        :key="channel.id"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    //   我的频道的接受的值
    userChannels: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEditShow: false // 编辑的状态
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
  watch: {
    // 当 userChannels 发生改变的时候，将该数据存储到本地存储
    userChannels () {
      setItem('user-channels', this.userChannels)
    }
  },
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
    },
    userChannel (index) {
      if (this.isEditShow && index !== 0) { // 如果是编辑状态就删除频道
        this.userChannels.splice(index, 1)
      } else {
        this.$emit('input', index)// 修改激活页的标签
        this.$emit('close') // 关闭弹层
      }
    }
  }
}
</script>

<style scoped lang=less>
.channel-edit {
  padding: 40px 0;
}
/deep/ .van-grid-item__icon-wrapper {
  position: absolute;
  top: -14px;
  right: -5px;
  .van-icon-close {
    font-size: 14px;
  }
}
.txt{
  font-size: 16px
}
.active{
  color: red
}
</style>
