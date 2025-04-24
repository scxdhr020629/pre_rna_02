// DrugMiRNAQuery
export default {
    path: '/prediction',
    title: 'Prediction',
    icon: 'database',
    children: [
      { path: '/prediction/prediction-mda', title: 'DrugMiRNAQuery', icon: 'database' },
      { path: '/prediction/prediction-mda-relation', title: 'DrugMiRNACustomizeQuery', icon: 'database' },
      { path: '/prediction/mda-knowledge-graph', title: 'MDAKnowledgeGraph', icon: 'database' },
    ]
  }
  