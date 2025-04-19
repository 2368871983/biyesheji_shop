import request from '@/utils/request'

export const getHomeData = () => {
  return request({
    url: '/page/detail',
    method: 'GET',
    params: {
      pageId: 0
    }
  })
}