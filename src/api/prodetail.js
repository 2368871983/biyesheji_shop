import request from '@/utils/request'

export const getProdetailData = (id) => {
  return request({
    url: '/goods/detail',
    method: 'GET',
    params: {
      goodsId: id
    }
  })

}