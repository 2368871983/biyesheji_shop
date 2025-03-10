/* 封装axios用于发送请求 */
// import { showDialog } from 'vant';
import axios from 'axios'
import { useUserStore } from '@/stores'


// 创建一个新的axios实例
const instance = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
})

// 添加请求拦截器
instance.interceptors.request.use(

  (config) => {
    const userStore = useUserStore()

    if (userStore.token) {
      config.headers['Access-Token'] = userStore.token
    }
    config.headers.platform = 'H5'
    // eslint-disable-next-line no-undef
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0,
    })
    return config
  },
  (error) => {
    // 对请求错误做些什么
    Promise.reject(error)
  }

)

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 在请求失败时隐藏加载提示

    // eslint-disable-next-line no-undef
    closeToast()
    // 对响应数据做点什么
    if (res.data.status === 200) {
      return res.data
    }
    // eslint-disable-next-line no-undef
    showNotify({
      type: 'warning',
      message: res.data.message,
      color: 'white',
      background: '#ee0a24',
      duration: 1500,
    })
    return Promise.reject(res.data)

  },
  (err) => {
    // 对响应错误做点什么
    // eslint-disable-next-line no-undef
    showDialog({
      message: err.res || '服务异常'
    }).then(() => {

    })
    return Promise.reject(err)
  },
)

export default instance
