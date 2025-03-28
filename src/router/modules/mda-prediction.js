import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

const meta = { auth: true }

export default {
  path: '/prediction',
  name: 'prediction',
  meta,
  redirect: { name: 'DrugMiRNAQuery' },
  component: layoutHeaderAside,
  children: [
    { path: 'prediction-mda', name: 'DrugMiRNAQuery', component: _import('prediction/prediction-mda'), meta: { ...meta, title: 'DrugMiRNAQuery' } },
    { path: 'prediction-mda-relation', name: 'DrugMiRNACustomizeQuery', component: _import('prediction/prediction-mda-relation'), meta: { ...meta, title: 'DrugMiRNACustomizeQuery' } }
  ]
}
