// 频道接口模块
import request from '@/utils/request'
// 获取所有频道
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
