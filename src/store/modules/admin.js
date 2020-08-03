import { login, logout, getInfo } from '@/api/admin'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    return login({ username: username.trim(), password: password }).then(response => {
      if (response.code === 200) {
        const { data } = response
        const token = data.token_type + ' ' + data.access_token
        commit('SET_TOKEN', token)
        setToken(token)
        return response
      }
    }).catch(error => {
      // reject(error)
      console.log(error)
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    })
    // })
  },

  // get user info
  getInfo({ commit, state }) {
    // return new Promise((resolve, reject) => {
    return getInfo().then(response => {
      commit('SET_NAME', response.data.username)
      commit('SET_AVATAR', response.data.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
      // resolve(data)
    }).catch(error => {
      console.log(error)
      // Message({
      //   message: error.message,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
    })
    // })
  },

  // user logout
  logout({ commit, state }) {
    // return new Promise((resolve, reject) => {
    return logout(state.token).then(() => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
    }).catch(error => {
      console.log(error)
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

