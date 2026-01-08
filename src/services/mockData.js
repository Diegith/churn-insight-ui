export const dashboardData = {
  stats: [
    { label: 'Total Clientes', value: '10,000', change: '+12%', icon: 'users' },
    { label: 'Riesgo Alto', value: '145', change: '+5%', icon: 'alert' },
    { label: 'Tasa de Churn', value: '20.37%', change: '-2%', icon: 'trending' },
    { label: 'Salario estimado', value: '$850', change: '+8%', icon: 'dollar' },
  ],
  chartData: [
    { name: 'Ene', churn: 400, retention: 2400 },
    { name: 'Feb', churn: 300, retention: 1398 },
    { name: 'Mar', churn: 200, retention: 9800 },
    { name: 'Abr', churn: 278, retention: 3908 },
  ],
  riskDistribution: [
    { name: 'Bajo', value: 1500, fill: '#10b981' },
    { name: 'Medio', value: 700, fill: '#f59e0b' },
    { name: 'Alto', value: 340, fill: '#ef4444' },
  ]
};