import router, { asyncRouterMap } from '../router'

// 动态添加路由
export function dynamicAddRoutes(permissions) {
  const newRouter = [...asyncRouterMap]
  filterRouter(newRouter, permissions)
  // 过滤后添加404
  newRouter.push({ path: '*', redirect: '/404', hidden: true })
  // 动态添加路由
  router.addRoutes(newRouter)
  router.options.routes = router.options.routes.concat(newRouter)
}

// 递归过滤掉无权限的路由
export function filterRouter(routers, permissions) {
  var resRouters = routers
  for (let i = 0; i < resRouters.length; i++) {
    var obj = resRouters[i]
    if (permissions.indexOf(obj.name) === -1) {
      resRouters.splice(i, 1)
      i--
      continue
    }
    if (obj.children) {
      filterRouter(obj.children, permissions)
    }
  }
}
