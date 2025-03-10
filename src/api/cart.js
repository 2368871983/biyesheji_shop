import request from '@/utils/request'

export const addCartData = (obj) => {
  const { goodsId, goodsNum, goodsSkuId } = obj
  return request({
    url: '/cart/add',
    method: 'POST',
    params: {
      goodsId,
      goodsNum,
      goodsSkuId,
    }

  })
}
export const updateCartData = (obj) => {
  const { goodsId, goodsNum, goodsSkuId } = obj
  return request({
    url: '/cart/update',
    method: 'POST',
    params: {
      goodsId,
      goodsNum,
      goodsSkuId,
    }

  })
}

export const getCartData = () => {
  return request({
    url: '/cart/list',
    method: 'GET',
  })
}