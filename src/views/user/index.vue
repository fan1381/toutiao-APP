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
    <nickname @close='isEditName=false' @confirm='onSave' :name='user.name'></nickname>
    <birthday></birthday>
    <gender></gender>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile, updateUserProfile } from '@/api/user.js'// 获取用户资料
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
    // 获取用户资料
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        console.log(err)
        this.$toast.fail('获取数据失败')
      }
    },
    // 修改用户昵称
    async onSave (name) {
      this.$toast.loading({
        duration: 0, // 持续展示
        message: '保存中',
        forbidClick: true// 是否禁止背景点击
      })
      try {
        this.user.name = name// 修改数据
        await updateUserProfile({ name: name })
        this.$toast('修改成功')
        this.isEditName = false// 关闭弹层
      } catch (err) {
        this.$toast('操作失败')
      }
    }
  }
}
</script>
