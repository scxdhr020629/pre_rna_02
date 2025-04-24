<template>
  <div class="graph-stats">
    <h2>图谱统计</h2>
    <div class="stats-container">
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.totalNodes }}</div>
        <div class="stat-label">节点总数</div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.totalEdges }}</div>
        <div class="stat-label">关系总数</div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.drugCount }}</div>
        <div class="stat-label">药物数量</div>
      </el-card>
      
      <el-card class="stat-card">
        <div class="stat-value">{{ stats.rnaCount }}</div>
        <div class="stat-label">RNA数量</div>
      </el-card>
    </div>
    
    <div class="node-distribution">
      <h3>节点分布</h3>
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
          data: ['药物', 'RNA']
        },
        series: [
          {
            name: '节点类型',
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
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.stats.drugCount, name: '药物', itemStyle: { color: '#5470c6' } },
              { value: this.stats.rnaCount, name: 'RNA', itemStyle: { color: '#91cc75' } }
            ]
          }
        ]
      };
      
      this.chart.setOption(option);
    }
  }
};
</script>

<style scoped>
.graph-stats {
  margin-top: 20px;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  padding: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-top: 5px;
}

.node-distribution {
  margin-top: 20px;
}

.distribution-chart {
  height: 200px;
  margin-top: 10px;
}

h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #303133;
}
</style>