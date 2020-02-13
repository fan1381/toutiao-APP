<template>
  <div>
    <van-nav-bar title="个人信息" left-arrow right-text="保存" @click-left="$router.back()" />
    <van-cell-group>
      <van-cell title="头像" is-link @click="onFile">
        <van-image round width="30" height="30" fit="cover" :src="user.photo" />
      </van-cell>
      <input type="file" hidden ref="file" @change="onFileChange" />
      <!--头像上传控件 -->
      <van-cell title="昵称" :value="user.name" is-link @click="isEditName=true" />
      <van-cell title="性别" :value="user.gender===0?'男':'女'" is-link @click="isEditGender = true" />
      <van-cell title="生日" :value="user.birthday" is-link @click="isEditBirthday=true" />
    </van-cell-group>
    <van-popup v-model="isEditName" position="bottom">
      <nickname @close="isEditName=false" @confirm="onSaveName" :name="user.name"></nickname>
      <birthday></birthday>
      <gender></gender>
    </van-popup>
    <!-- 修改用户性别 -->
    <van-action-sheet
      v-model="isEditGender"
      :actions="actions"
      @select="onGenderSelect"
      cancel-text="取消"
    />
    <!-- 修改生日 -->
    <van-popup v-model="isEditBirthday" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="isEditBirthday=false"
        @confirm="onBirthday"
      />
    </van-popup>
    <!-- 头像上传预览 -->
    <van-image-preview v-model="isPreviewShow" :images="images" @close='file.value=""'>
      <van-nav-bar
        slot="cover"
        left-text="取消"
        right-text="确定"
        @click-left="isPreviewShow = false"
        @click-right="onUpdateAvatar"
      />
    </van-image-preview>
  </div>
</template>

<script>
import { getUserProfile, updateUserProfile, updateUserPhoto } from '@/api/user.js' // 获取用户资料
import birthday from './components/edit-birthday'
import gender from './components/edit-gender'
import nickname from './components/edit-nickname'
import moment from 'moment'
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
      isEditGender: false,
      isEditBirthday: false,
      images: [], // 预览的图片列表
      actions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      minDate: new Date(1910, 0, 1), // 最小时间
      maxDate: new Date(), // 最大时间
      currentDate: new Date(), // 控制默认时间
      isPreviewShow: false // 头像上传预览
    }
  },
  computed: {
    file () {
      return this.$refs['file']
    }
  },
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
    // 封装一个统一的保存的方法
    async save (field, value) {
      this.$toast.loading({
        duration: 0, // 持续展示
        message: '保存中',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        await updateUserProfile({
          [field]: value
        })
        this.$toast('保存成功')
      } catch (error) {
        this.$toast('保存失败')
      }
    },
    // 修改用户昵称
    async onSaveName (name) {
      await this.save('name', name)
      this.user.name = name // 修改数据
      this.isEditName = false // 关闭弹层
    },
    // 修改性别
    async onGenderSelect ({ value }) {
      await this.save('gender', value)
      this.user.gender = value
      this.isEditGender = false
    },
    // 修改生日
    async onBirthday (value) {
      value = moment(value).format('YYYY-MM-DD') // 处理时间格式
      await this.save('brithday0', value)
      this.user.birthday = value
      this.isEditBirthday = false
    },
    // 修改头像
    async onFile () {
      this.file.click() // 收到触发dom节点的点击事件
    },
    // 上传头像预览
    onFileChange () {
      const fileObj = this.file.files[0] // 文件对象
      const fileData = URL.createObjectURL(fileObj) // 获取文件数据
      this.images = [fileData] // 将要预览的图片放到数组中
      this.isPreviewShow = true // 显示图片预览
    },
    async onUpdateAvatar () {
      this.$toast.loading({
        duration: 0, // 持续展示
        message: '保存中',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        const fd = new FormData()
        fd.append('photo', this.file.files[0])
        const { data } = await updateUserPhoto(fd)
        this.user.photo = data.data.photo
        this.$toast('上传成功')
        this.isPreviewShow = false
      } catch (error) {
        this.$toast('上传失败')
      }
    }
  }
}
</script>
<style scoped lang="less" >
/deep/ .van-image-preview__cover {
  top: unset;
  left: 0;
  bottom: 0;
  right: 0;
  .van-nav-bar {
    background-color: #181818;
    .van-nav-bar__text {
      color: #fff;
    }
  }
}
</style>
