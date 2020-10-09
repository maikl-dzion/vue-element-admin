import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// const headers  = {
//   "Accept": "application/json",
//   "Access-Control-Allow-Origin": "*",
//   "X-Requested-With": "XMLHttpRequest",
//   "Access-Control-Allow-Methods" : "GET,POST,PUT,DELETE,OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
// }

const headers = {}

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers = headers
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => {
    // debugger;
    const result = response.data
    return result
  },

  error => {
    // debugger;
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    // let r = 10;
    // lg(error.message);
    return Promise.reject(error)
  }

)

export default service
