<template>
  <div class="graph-stats">
    <div class="section-header">
      <i class="el-icon-data-analysis"></i>
      <span>Graph Statistics</span>
    </div>
    
    <div class="stats-container">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-value">{{ stats.totalNodes }}</div>
        <div class="stat-label">Total Nodes</div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-value">{{ stats.totalEdges }}</div>
        <div class="stat-label">Total Relationships</div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-value">{{ stats.drugCount }}</div>
        <div class="stat-label">Drug Count</div>
      </el-card>
      
      <el-card class="stat-card" shadow="hover">
        <div class="stat-value">{{ stats.rnaCount }}</div>
        <div class="stat-label">miRNA Count</div>
      </el-card>
    </div>
    
    <div class="node-distribution">
      <div class="section-header secondary">
        <i class="el-icon-pie-chart"></i>
        <span>Node Distribution</span>
      </div>
      <div ref="distributionChart" class="distribution-chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'GraphStats',
  props: {
    stats: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initDistributionChart();
    window.addEventListener('resize', this.resizeChart);
  },
  watch: {
    stats: {
      handler() {
        this.updateDistributionChart();
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    window.removeEventListener('resize', this.resizeChart);
  },
  methods: {
    initDistributionChart() {
      const chartDom = this.$refs.distributionChart;
      this.chart = echarts.init(chartDom);
      this.updateDistributionChart();
    },
    updateDistributionChart() {
      if (!this.chart) return;
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: ['Drugs', 'RNA'],
          textStyle: {
            color: '#606266'
          }
        },
        series: [
          {
            name: 'Node Types',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold',
                color: '#2c3e50'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.stats.drugCount, name: 'Drugs', itemStyle: { color: '#5470c6' } },
              { value: this.stats.rnaCount, name: 'RNA', itemStyle: { color: '#91cc75' } }
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
      
      this.chart.setOption(option);
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    }
  }
};
</script>

<style scoped>
.graph-stats {
  margin-top: 20px;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Section header styles */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f2f5;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, #409eff, #67c23a);
}

.section-header.secondary {
  margin-top: 30px;
  padding-bottom: 12px;
}

.section-header.secondary::after {
  width: 60px;
}

.section-header i {
  font-size: 22px;
  margin-right: 12px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-header span {
  font-size: 17px;
  font-weight: 600;
  color: #2c3e50;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  padding: 15px 10px;
  border-radius: 10px;
  transition: all 0.3s ease;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.stat-value {
  font-size: 26px;
  font-weight: bold;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 5px;
  animation: countUp 2s ease-out forwards;
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-top: 5px;
}

.node-distribution {
  margin-top: 10px;
}

.distribution-chart {
  height: 250px;
  margin-top: 15px;
  animation: fadeIn 1s ease-out 0.3s both;
  background-color: #fafafa;
  border-radius: 10px;
  padding: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
}

/* Layout adjustments for smaller screens */
@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-value {
    font-size: 22px;
  }
  
  .stat-label {
    font-size: 12px;
  }
  
  .distribution-chart {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>