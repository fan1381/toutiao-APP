// 文章接口模块
import request from '@/utils/request'
// 根据文章类型获取文章列表
export const getArticle = (params) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}
