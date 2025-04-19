import request from '@/utils/request';

export const getCartPay = (mode, cartIds) => {
  return request({
    url: '/checkout/order',
    method: 'GET',
    params: {
      mode,
      delivery: 10,
      shopId: 0,
      couponId: 0,
      isUsePoints: 0,
      cartIds
    }
  });
};
export const getBuyNowPay = (mode, goodsId, goodsNum, goodsSkuId) => {
  return request({
    url: '/checkout/order',
    method: 'GET',
    params: {
      mode,
      delivery: 10,
      shopId: 0,
      couponId: 0,
      isUsePoints: 0,
      goodsId,
      goodsNum,
      goodsSkuId,

    }
  });
};

export const submitBuyNowPay = (mode, goodsId, goodsNum) => {
  return request({
    url: '/checkout/submit',
    method: 'POST',
    params: {
      mode,
      delivery: 10,
      couponId: 0,
      payType: 10,
      isUsePoints: 0,
      remark: '',
      goodsId,
      goodsNum,
      goodsSkuId: 0,

    }
  });
}
export const submitCartPay = (mode, cartIds) => {
  return request({
    url: '/checkout/submit',
    method: 'POST',
    params: {
      mode,
      delivery: 10,
      couponId: 0,
      payType: 10,
      isUsePoints: 0,
      remark: '',
      cartIds

    }
  });
}