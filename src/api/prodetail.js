import request from '@/utils/request'
// 获取商品详情数据
export const getProdetailData = (id) => {
  return request({
    url: '/goods/detail',
    method: 'GET',
    params: {
      goodsId: id
    }
  })

}

// 获取商品评价
export const getProComment = (id) => {
  return request({
    url: '/comment/listRows',
    method: 'GET',
    params: {
      goodsId: id,
      limit: 3
    }
  })
}
