import { uniqueId } from 'lodash'

// 插件
import demoPlugins from './modules/demo-plugins'
// 组件
import demoComponents from './modules/demo-components'
// 功能
import demoPlayground from './modules/demo-playground'
// 邮件
import mdaEmail from './modules/mda-email'
// 预测
import mdaPrediction from './modules/mda-prediction'
// help
import mdaHelp from './modules/mda-help'
// about
import mdaAbout from './modules/mda-about'
import mdaChat from './modules/mda-chat'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

// 菜单 侧边栏
export const menuAside = supplementPath([
  demoComponents,
  demoPlugins,
  demoPlayground,
  mdaPrediction

])

// 菜单 顶栏
export const menuHeader = supplementPath([
  {
    path: '/index',
    title: 'Home',
    icon: 'home'
  },
  // 先屏蔽掉
  // demoPlayground,
  // demoComponents,
  // demoPlugins,
  mdaPrediction,
  mdaEmail,
  mdaHelp,
  mdaAbout,
  mdaChat
])
