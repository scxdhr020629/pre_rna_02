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
          title:'Home',
          auth: true
        },
        component: _import('system/index')
      },
      // 演示页面
      // {
      //   path: 'page1',
      //   name: 'page1',
      //   meta: {
      //     title: 'Page 1',
      //     auth: true
      //   },
      //   component: _import('demo/page1')
      // },
      // {
      //   path: 'page2',
      //   name: 'page2',
      //   meta: {
      //     title: 'Page 2',
      //     auth: true
      //   },
      //   component: _import('demo/page2')
      // },
      // {
      //   path: 'page3',
      //   name: 'page3',
      //   meta: {
      //     title: 'Page 3',
      //     auth: true
      //   },
      //   component: _import('demo/page3')
      // },
      // test
      // {
      //   path: 'demo-page',
      //   name: 'demo-page',
      //   meta: {
      //     title: 'demo-page',
      //     auth: true
      //   },
      //   component: _import('demo/page-demo')
      // },
      // prediction
      // {
      //   path: 'description-mda',
      //   name: 'description-mda',
      //   meta: {
      //     title: 'DESCR',
      //     auth: true
      //   },
      //   component: _import('prediction/description-mda')
      // },
      {
        path: 'prediction-mda',
        name: 'prediction-mda',
        meta: {
          title: 'MDA',
          auth: true
        },
        component: _import('prediction/prediction-mda')
      },
      // help
      {
        // 帮助文档
        path: 'help-document',
        name: 'help-document',
        meta: {
          title: 'help-document',
          auth: true
        },
        component: _import('help/help-document')
      },
      // 发送邮件
      {
        path: 'email',
        name: 'email',
        meta: {
          title: 'Email',
          auth: true
        },
        component: _import('email')
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
      // Publiction
      {
        path: 'publication',
        name: 'publication',
        meta: {
          title: 'Publication',
          auth: true
        },
        component: _import('publication')
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
      }
    ]
  }
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
