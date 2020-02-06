import request from '@/utils/request'
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
