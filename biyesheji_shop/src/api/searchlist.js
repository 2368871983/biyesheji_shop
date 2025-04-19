import request from '@/utils/request'

// 获取商品列表数据
export const getSearchlist = (obj) => {
  const { sortType, sortPrice, categoryId, goodsName, page } = obj
  return request({
    url: '/goods/list',
    method: 'GET',
    params: {
      sortType,
      sortPrice,
      categoryId,
      goodsName,
      page
    }
  })

}