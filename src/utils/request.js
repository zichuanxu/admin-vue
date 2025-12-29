import axios from 'axios'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 1. 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 5000 // 请求超时时间
})

// 2. 请求拦截器 (Request Interceptor)
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    // 如果有 token，统一在 header 中携带
    // 注意：后端 AuthInterceptor 里获取的是 "Authorization"
    const token = userStore.token || localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = token
    }

    // 如果是 FormData (文件上传)，不要强制设置 Content-Type 为 json
    // 让浏览器自动设置为 multipart/form-data 并带上 boundary
    if (!config.headers['Content-Type'] && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 3. 响应拦截器 (Response Interceptor)
request.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数
    // 这里的 response 是 Axios 封装的对象，response.data 才是后端返回的 Result
    const res = response.data


    // 如果是二进制数据（文件流），直接返回，不进行 code 校验
    if (response.config.responseType === 'blob' || res instanceof Blob) {
      return res
    }

    // 假设你的后端 Result 结构是 { code: 200, msg: "success", data: ... }
    // 如果 code 不是 200，说明业务逻辑有错
    if (res.code !== 200) {
      ElMessage.error(res.msg || '系统异常')

      // 特殊情况：如果是 401 (未登录或Token失效)，通常后端会返回特定的 code
      // 这里假设你的后端在鉴权失败时，Http状态码直接返回了 200 但 code 是 401
      // 如果后端直接返回 Http 401 状态码，逻辑会跳到下方的 error 分支
      if (res.code === 401) {
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
      }

      return Promise.reject(new Error(res.msg || 'Error'))
    }

    // 业务逻辑正常，只返回后端的数据部分 (Result 对象)
    return res
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数 (例如 HTTP 401, 403, 404, 500)
    console.error('Request Error:', error)

    let msg = '系统异常'
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          msg = '未登录或Token已过期'
          const userStore = useUserStore()
          userStore.logout()
          router.push('/login')
          break
        case 403:
          msg = error.response.data?.message || '无权访问'
          break
        case 404:
          msg = error.response.data?.message || '请求地址出错'
          break
        case 500:
          msg = error.response.data?.message || '服务器内部错误'
          break
        default:
          msg = error.response.data?.message || '网络错误'
      }
    }

    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

export default request