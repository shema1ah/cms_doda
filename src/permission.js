import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken, getUserInfo } from './utils/auth' // 验权
import { dynamicAddRoutes } from './utils/filterRouter' // 过滤路由
// 全屏加载遮罩层
// import { Loading } from 'element-ui'
// const options = { fullscreen: true, lock: true, text: '拼命加载中' }
// const loaded = Loading.service(options)
// loaded.close()
const whiteList = ['/login'] // 不重定向白名单,方便登录使用
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 是否有token
  if (getToken()) {
    // 是否登录
    if (!store.getters.isLogin) {
      // 获取个人信息和权限
      store.dispatch('Login', JSON.parse(getUserInfo())).then(permissions => {
        // 返回权限
        dynamicAddRoutes(permissions)
        NProgress.done()
        // 修改权限后如果当前页面没有权限，则跳转到首页
        if (permissions.indexOf(location.pathname.slice(1)) === -1) {
          location.replace(process.env.SSO)
        } else {
          next({ ...to, replace: true })// hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        }
      }).catch(err => {
        store.dispatch('FedLogOut').then(() => {
          Message.error(err || '验证失败，请重新登录')
          NProgress.done()
          next({ path: '/' })
        })
      })
    } else {
      // 登录直接next
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
})
