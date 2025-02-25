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
export const getProComment = (id, limit) => {
  return request({
    url: '/comment/listRows',
    method: 'GET',
    params: {
      goodsId: id,
      limit: limit || 3
    }
  })
}
// 获取商品保障服务

export const getProService = (id) => {
  return request({
    url: '/goods.service/list',
    method: 'GET',
    params: {
      goodsId: id
    }
  })
}
