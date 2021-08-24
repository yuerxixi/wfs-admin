import request from '@/utils/request'

export function login(username, password, code, uuid) {
  return request({
    url: 'oauth/sys/login',
    // url: 'oauth/sys/login',
    method: 'post',
    data: {
      username,
      password,
      captcha: code,
      uuid
    }
  })
}

export function getCodeImg(uuid) {
  return request({
    url: 'oauth/captcha',
    method: 'get',
    params: { uuid }
  })
}

export function logout(data) {
  return request({
    url: '/oauth/sys/logout',
    // url: '/oauth/sys/logout',
    method: 'post',
    data
  })
}
