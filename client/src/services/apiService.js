import axios from 'axios'
import { API_BASE_URL } from '../config'

const API_SERVICE = (token = null) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`,
    },
  }

  return {
    get: (url, options = {}) => axios.get(API_BASE_URL + url, { ...defaultOptions, ...options }),
    post: (url, data, options = {}) => axios.post(API_BASE_URL + url, data, { ...defaultOptions, ...options }),
    put: (url, data, options = {}) => axios.put(API_BASE_URL + url, data, { ...defaultOptions, ...options }),
    delete: (url, options = {}) => axios.delete(API_BASE_URL + url, { ...defaultOptions, ...options }),
    patch: (url, data, options = {}) => axios.patch(API_BASE_URL + url, data, { ...defaultOptions, ...options }),
  }
}

export default API_SERVICE