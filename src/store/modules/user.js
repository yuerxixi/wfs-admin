import { login, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    noLoginToken: '9310547cf48f712ba121411409bf5604',
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
          if (res.code === 0 || res.code === 200) {
            setToken(res.token, rememberMe)
            commit('SET_TOKEN', res.token)
            // setUserInfo(res.user, commit)
            setUserInfo({
              roles: [],
              user: {}
            }, commit)
            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            commit('SET_LOAD_MENUS', true)
            resolve()
          } else {
            return res.msg
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息（刷新的时候vuex，重新请求路由）
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        setUserInfo({
          roles: [],
          user: {}
        }, commit)
        resolve()
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.noLoginToken === state.token) {
          logOut(commit)
          resolve()
        } else {
          logout({}).then(res => {
            logOut(commit)
            resolve()
          }).catch(error => {
            logOut(commit)
            reject(error)
          })
        }
      })
    },
    TokenExpire({ commit, state }) {
      return new Promise((resolve, reject) => {
        logOut(commit)
        resolve()
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
  removeToken()
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res.user)
}

export default user
