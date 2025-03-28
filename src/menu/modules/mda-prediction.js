// DrugMiRNAQuery
export default {
    path: '/prediction',
    title: 'Prediction',
    icon: 'database',
    children: [
      { path: '/prediction/prediction-mda', title: 'DrugMiRNAQuery', icon: 'database' },
      { path: '/prediction/prediction-mda-relation', title: 'DrugMiRNACustomizeQuery', icon: 'database' }
    ]
  }
  