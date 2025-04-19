import request from '@/utils/request'

export const getAddressList = () => {
  return request({
    url: '/address/list',
    method: 'GET',
  })
}
// api地址
const api = {
  all: 'region/all',
  tree: 'region/tree'
}

// 获取所有地区
export const all = (param) => {
  return request.get(api.all, param)
}

// 获取所有地区(树状)
export const tree = (param) => {
  return request.get(api.tree, param)
}

export const addAddressList = (name, phone, provinceCode, province, cityCode, city, countyCode, county, detail) => {
  return request({
    url: '/address/add',
    method: 'POST',
    data: {
      form: {
        name,
        phone,
        region: [
          { value: provinceCode, label: province },
          { value: cityCode, label: city },
          { value: countyCode, label: county }
        ],
        detail
      }
    }
  });
};
export const deleteAddressList = (id) => {
  return request({
    url: '/address/remove',
    method: 'POST',
    params: {
      addressId: id
    }
  });
}

export const updateAddressList = (id, name, phone, provinceCode, province, cityCode, city, countyCode, county, detail) => {
  return request({
    url: '/address/edit',
    method: 'POST',
    data: {
      addressId: id,
      form: {
        name,
        phone,
        region: [
          { value: provinceCode, label: province },
          { value: cityCode, label: city },
          { value: countyCode, label: county }
        ],
        detail
      }
    }
  });
};
export const getAddressDetail = (id) => {
  return request({
    url: '/address/detail',
    method: 'GET',
    params: {
      addressId: id
    }
  });
}

export const setAddress = (id) => {
  return request({
    url: '/address/setDefault',
    method: 'POST',
    params: {
      addressId: id
    }
  });
}