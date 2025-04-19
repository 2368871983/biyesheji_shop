import request from '@/utils/request'


export const getUserInfo = () => {

  return request({
    url: '/user/info',
    method: 'GET',

  })

}

export const getMyOrder = (dataType, page) => {
  return request({
    url: '/order/list',
    method: 'GET',
    params: {
      dataType, page
    }
  })
}

export const cancelOrder = (orderId) => {
  return request({
    url: '/order/cancel',
    method: 'POST',
    params: {
      orderId
    }
  })
}