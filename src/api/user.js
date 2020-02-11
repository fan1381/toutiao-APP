import request from '@/utils/request'
// 登录
export const login = (data) => {
  return request({
    method: 'POST', // 请求方法
    url: '/app/v1_0/authorizations', // 请求路径
    // headers: {
    //   // 'Content-Type': 'application/json'不用写
    //   // axios 会自动添加该请求头
    // }, 请求头
    // params: {}, // query查询参数
    data // 请求体参数
  })
}

// 发送验证码
export const code = (mobile) => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

// 获取当前登录用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}

// 获取当前登录用户频道列表或默认推荐列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 添加关注用户
export const addFollow = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 取消关注
export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
