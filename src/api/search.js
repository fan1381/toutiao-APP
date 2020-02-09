// 搜索接口模块
import request from '@/utils/request'
// 根据文章类型获取文章列表
// 联想建议
export const getSuggestions = (q) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 搜索结果
export const getSearch = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
