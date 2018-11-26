import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () =>
      import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () =>
      import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Home',
    children: [{
      path: 'home',
      component: () =>
        import('@/views/home/index'),
      meta: {
        title: '首页',
        icon: 'home'
      }
    }]
  }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  // 后台管理
  {
    path: '/manage',
    component: Layout,
    name: 'manage',
    redirect: 'manage/routers',
    meta: {
      title: '后台管理',
      icon: 'lock'
    },
    children: [
      // 路由管理
      {
        path: 'routers',
        component: () =>
          import('@/views/routers/index'),
        name: 'manage/routers',
        meta: {
          title: '路由管理'
        }
      },
      // 角色管理
      {
        path: 'role',
        component: () =>
          import('@/views/role/index'),
        name: 'manage/role',
        meta: {
          title: '角色管理'
        }
      },
      // 权限管理
      {
        path: 'access',
        component: () =>
          import('@/views/access/index'),
        name: 'manage/access',
        meta: {
          title: '权限管理'
        }
      }
    ]
  },
  // 哆哒管理后台
  {
    path: '/doda',
    component: Layout,
    name: 'doda',
    meta: {
      title: '哆哒管理',
      icon: 'operation'
    },
    children: [
      // 哆哒数据配置
      {
        path: 'index',
        component: () =>
          import('@/views/doda/configuration'),
        name: 'doda/index',
        meta: {
          title: '哆哒数据配置'
        }
      },
      // 哆哒数据配置
      {
        path: 'check',
        component: () =>
          import('@/views/doda/dodaCheck'),
        name: 'doda/check',
        meta: {
          title: '哆哒作品审核'
        }
      },
      // 圣地洗礼
      {
        path: 'holyland',
        component: () =>
          import('@/views/doda/holyland'),
        name: 'doda/holyland',
        meta: {
          title: '圣地巡礼'
        }
      },
      // 分享配置
      {
        path: 'gameList',
        component: () =>
          import('@/views/doda/share/gameList'),
        name: 'doda/gameList',
        meta: {
          title: '分享配置列表'
        }
      },
      // 分享详细配置
      {
        path: 'shareConfig',
        component: () =>
          import('@/views/doda/share/shareConfig'),
        name: 'doda/shareConfig',
        meta: {
          title: '分享配置'
        },
        hidden: true
      },
      // 云控配置
      {
        path: 'cloudConfig',
        component: () => import('@/views/doda/cloud/index'),
        name: 'doda/cloudConfig',
        meta: { title: '客户端云控配置' },
        children: [
          {
            path: 'ios',
            component: () => import('@/views/doda/cloud/cloudList'),
            name: 'doda/cloudConfig/ios',
            meta: { title: 'ios', type: 1 }
          },
          {
            path: 'android',
            name: 'doda/cloudConfig/android',
            component: () => import('@/views/doda/cloud/cloudList'),
            meta: { title: 'android', type: 0 }
          },
          {
            path: 'basic',
            name: 'doda/cloudConfig/basic',
            component: () => import('@/views/doda/cloud/cloudConfig'),
            meta: { title: '基础信息配置', type: 1 },
            hidden: true
          }
        ]
      }

    ]
  },
  // 延禧攻略
  {
    path: '/yxgl',
    component: Layout,
    name: 'yxgl',
    meta: {
      title: '延禧攻略',
      icon: 'form'
    },
    children: [
      // 剧本管理
      {
        path: 'scenario',
        component: () =>
          import('@/views/yxgl/scenario/index'), // Parent router-view
        name: 'yxgl/scenario',
        meta: {
          title: '剧本管理'
        }
      },
      // 剧本管理
      {
        path: 'scenario/role',
        component: () =>
          import('@/views/yxgl/scenario/question'), // Parent router-view
        name: 'yxgl/scenario/role',
        hidden: true
      },
      // NPC管理
      {
        path: 'npc',
        component: () =>
          import('@/views/yxgl/npc/index'), // Parent router-view
        name: 'yxgl/npc',
        meta: {
          title: 'NPC管理'
        }
      },
      // 朋友圈管理
      {
        path: 'friend',
        component: () =>
          import('@/views/yxgl/friend/index'), // Parent router-view
        name: 'yxgl/friend',
        meta: {
          title: '朋友圈管理'
        }
      },
      // 朋友圈管理
      {
        path: 'friend/role',
        component: () =>
          import('@/views/yxgl/friend/friend'), // Parent router-view
        name: 'yxgl/friend/role',
        hidden: true
      }

    ]
  },
  // 延禧攻略测试
  {
    path: '/yxtest',
    component: Layout,
    name: 'yxtest',
    meta: {
      title: '延禧攻略测试',
      icon: 'test'
    },
    children: [
      // 剧本管理
      {
        path: 'scenario',
        component: () =>
          import('@/views/yxtest/scenario/index'), // Parent router-view
        name: 'yxtest/scenario',
        meta: {
          title: '剧本管理'
        }
      },
      // 剧本管理
      {
        path: 'scenario/role',
        component: () =>
          import('@/views/yxtest/scenario/question'), // Parent router-view
        name: 'yxtest/scenario/role',
        hidden: true
      },
      // NPC管理
      {
        path: 'npc',
        component: () =>
          import('@/views/yxtest/npc/index'), // Parent router-view
        name: 'yxtest/npc',
        meta: {
          title: 'NPC管理'
        }
      },
      // 朋友圈管理
      {
        path: 'friend',
        component: () =>
          import('@/views/yxtest/friend/index'), // Parent router-view
        name: 'yxtest/friend',
        meta: {
          title: '朋友圈管理'
        }
      },
      // 朋友圈管理
      {
        path: 'friend/role',
        component: () =>
          import('@/views/yxtest/friend/friend'), // Parent router-view
        name: 'yxtest/friend/role',
        hidden: true
      }

    ]
  }
]
