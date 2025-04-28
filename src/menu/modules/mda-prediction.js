// DrugMiRNAQuery
export default {
    path: '/prediction',
    title: 'Prediction',
    icon: 'star', // 非常常用的图标
    children: [
      { path: '/prediction/prediction-mda', title: 'DrugMiRNAQuery', icon: 'flask' },
      { path: '/prediction/prediction-mda-relation', title: 'DrugMiRNACustomizeQuery', icon: 'bell' },
      { path: '/prediction/mda-knowledge-graph', title: 'MDAKnowledgeGraph', icon: 'map' },
    ]
  }
