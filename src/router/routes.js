import playground from './modules/playground'
import plugins from './modules/plugins'
import components from './modules/components'
import mdaEmail from './modules/mda-email'
import mdaPrediction from './modules/mda-prediction'

import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          title: 'Home',
          auth: true
        },
        component: _import('system/index')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      },
      // 发送邮件
      {
        path: 'email',
        name: 'email',
        meta: {
          title: 'email',
          auth: true
        },
        component: _import('email')
      },
      // help
      {
        path: 'help',
        name: 'help',
        meta: {
          title: 'help',
          auth: true
        },
        component: _import('help')
      },
      // about
      {
        path: 'about',
        name: 'about',
        meta: {
          title: 'about',
          auth: true
        },
        component: _import('about')
      },
      {
        path: 'chat',
        name: 'chat',
        meta: {
          title: 'chat',
          auth: true
        },
        component: _import('chat')
      }
    ]
  },
  playground,
  plugins,
  components,
  mdaPrediction
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
