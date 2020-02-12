<template>
  <div>
    <van-nav-bar title="个人信息" left-arrow right-text="保存"
     @click-left="$router.back()" />
    <van-cell-group>
      <van-cell title="头像" is-link>
        <van-image
          round
          width="30"
          height="30"
          fit="cover"
          :src="user.photo"
        />
      </van-cell>
      <van-cell title="昵称" :value="user.name" is-link  @click="isEditName=true"/>
      <van-cell title="性别" :value="user.gender===0?'男':'女'" is-link />
      <van-cell title="生日" :value="user.birthday" is-link />
    </van-cell-group>
    <van-popup
        v-model="isEditName"
        position="bottom"
    >
    <nickname ></nickname>
    <birthday></birthday>
    <gender></gender>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user.js'// 获取用户资料
import birthday from './components/edit-birthday'
import gender from './components/edit-gender'
import nickname from './components/edit-nickname'
export default {
  name: 'UserProfile',
  components: {
    birthday,
    gender,
    nickname
  },
  props: {},
  data () {
    return {
      user: {}, // 用户资料
      isEditName: false,
      images: [] // 预览的图片列表
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
        console.log(data)
      } catch (err) {
        console.log(err)
        this.$toast.fail('获取数据失败')
      }
    }
  }
}
</script>
