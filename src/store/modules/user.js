import {
  login
} from '../../api/common/login'
import {
  getToken,
  setToken,
  removeToken,
  setUserInfo,
  removeUserInfo
} from '../../utils/auth'
const user = {
  state: {
    token: getToken(),
    isLogin: false,
    name: '',
    roleId: [] // 角色数组
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_LOGIN: (state, login) => {
      state.isLogin = login
    },
    SET_ROLEID: (state, roleId) => {
      state.roleId = roleId
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login({
          account: username,
          password: userInfo.password
        }).then(response => {
          const {
            adminList,
            token,
            userinfo: {
              name,
              role
            }
          } = response.data
          let menus = []
          let roleId = []
          if (adminList) {
            menus = adminList
            roleId = -1
          }
          if (role && role.menus) {
            menus = role.menus
            if (role.name === '管理员') {
              roleId = -1
            } else {
              roleId.push(role.id)
            }
          }
          const access = ['', 'home']
          menus.forEach(item => {
            access.push(...item.url.replace(/(^\s*)|(\s*$)/g, '').split(','))
          })
          // const access = ['', 'home', 'manage','manage/routers', 'manage/role', 'manage/access', 'doda', 'doda/index']
          commit('SET_NAME', name)
          commit('SET_TOKEN', token)
          commit('SET_ROLEID', roleId)
          setUserInfo(userInfo)
          setToken(token)
          commit('SET_LOGIN', true)
          resolve(access)
        }).catch(error => {
          console.log('错误走到这里了', error)
          reject(error)
        })
      })
    },
    // // 登录
    // GetInfo({ commit }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     getInfo().then(response => {
    //       const { permissions, user } = response.data
    //       const trimPermissions = permissions.map((item, index) => item.replace(/(^\s*)|(\s*$)/g, ''))
    //       commit('SET_NAME', user.username)
    //       commit('SET_LOGIN', true)
    //       resolve(trimPermissions.concat(['', 'home']))
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_LOGIN', false)
        commit('SET_ROLEID', [])
        removeUserInfo()
        removeToken()
        // 清除动态添加的路由
        // router.options.routes = constantRouterMap
        resolve(process.env.SSO)
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_LOGIN', false)
        commit('SET_ROLEID', [])
        removeUserInfo()
        removeToken()
        resolve()
      })
    }
  }
}

export default user
