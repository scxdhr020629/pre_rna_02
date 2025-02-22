import { uniqueId } from 'lodash'

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

export const menuHeader = supplementPath([
  { path: '/index', title: 'Home', icon: 'home' },
  {
    title: 'Page',
    icon: 'folder-o',
    // icon: 'database',
    children: [
      { path: '/page1', title: 'Page 1' },
      { path: '/page2', title: 'Page 2' },
      { path: '/page3', title: 'Page 3' },
      { path: '/demo-page', title: 'demo-page' }
    ]
  },
  // prediction
  // 这里的path 要和router 里的path 相互对应
  {
    title: 'Prediction',
    icon: 'database',
    children: [
      // { path: '/description-mda', title: 'DESCR',icon:'database' },
      { path: '/prediction-mda', title: 'MDA',icon:'database' }
    ]
  },
  // help 帮助部分
  {
    title: 'Help',
    icon: 'question',
    children: [
      // { path: '/help-document', title: 'help-document' },
      { path: '/help-document', title: 'Help-document',icon:'question' },
      { path: '/send-email', title: 'Send-email',icon:'question' },
    ]
  },
  // about 
  { path: '/about', title: 'About', icon: 'exclamation' }
])

export const menuAside = supplementPath([
  { path: '/index', title: 'Home', icon: 'home' },
  {
    title: 'Page',
    icon: 'folder-o',
    // icon: 'database',
    children: [
      { path: '/page1', title: 'Page 1' },
      { path: '/page2', title: 'Page 2' },
      { path: '/page3', title: 'Page 3' },
      { path: '/demo-page', title: 'demo-page' }
    ]
  },
  // prediction
  {
    title: 'prediction',
    icon: 'database',
    children: [
      // { path: '/description-mda', title: 'DESCR',icon:'database' },
      { path: '/prediction-mda', title: 'MDA',icon:'database' }
    ]
  },
  // help 帮助部分
  {
    title: 'help',
    icon: 'question',
    children: [
      { path: '/help-document', title: 'Help-document',icon:'question' },
      { path: '/send-email', title: 'Send-email' ,icon:'question' },
    ]
  },
  // about 
  { path: '/about', title: 'About', icon: 'exclamation' }
])
