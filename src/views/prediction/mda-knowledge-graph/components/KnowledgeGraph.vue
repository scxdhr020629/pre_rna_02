<template>
  <div class="graph-container">
    <div id="graphChart" ref="graphChart" class="graph"></div>
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: #5470c6"></div>
        <span>Drug</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #91cc75"></div>
        <span>RNA</span>
      </div>
    </div>
    <div class="controls">
      <el-button size="small" @click="resetGraph">Reset View</el-button>
      <el-slider v-model="forceStrength" :min="1" :max="100" @change="updateForce"></el-slider>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'KnowledgeGraph',
  props: {
    graphData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      forceStrength: 50,
      chartOption: {
        title: {
          text: 'Knowledge Graph',
          subtext: 'Drug-RNA Interactions',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (params.dataType === 'node') {
              return `
                <div>
                  <strong>${params.data.name}</strong><br/>
                  Type: ${params.data.type}<br/>
                  ID: ${params.data.id}
                </div>
              `;
            } else {
              return `
                <div>
                  <strong>Relationship</strong><br/>
                  Type: ${params.data.relationship}<br/>
                  Score: ${params.data.value.toFixed(2)}
                </div>
              `;
            }
          }
        },
        legend: {
          show: false
        },
        animation: true,
        animationDurationUpdate: 500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'force',
            draggable: true,
            roam: true,
            force: {
              repulsion: 500,
              edgeLength: 150
            },
            nodeScaleRatio: 0.6,
            selectedMode: 'single',
            lineStyle: {
              color: 'source',
              curveness: 0.3
            },
            edgeSymbol: ['circle', 'arrow'],
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 4
              }
            },
            categories: [
              { name: 'Drug', itemStyle: { color: '#5470c6' } },
              { name: 'RNA', itemStyle: { color: '#91cc75' } }
            ],
            data: [],
            edges: []
          }
        ]
      }
    };
  },
  mounted() {
    this.initChart();
  },
  watch: {
    graphData: {
      handler(newVal) {
        this.updateChart();
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
    initChart() {
      const chartDom = this.$refs.graphChart;
      this.chart = echarts.init(chartDom);
      
      // Set initial data
      this.updateChart();
      
      // Add resize event listener
      window.addEventListener('resize', this.resizeChart);
    },
    updateChart() {
      if (!this.chart) return;
      
      // Map nodes and links to ECharts format
      const nodes = this.graphData.nodes.map(node => ({
        id: node.id,
        name: node.name,
        symbolSize: node.symbolSize || 20,
        category: node.category,
        type: node.type,
        label: {
          show: true,
          formatter: node.name
        }
      }));
      
      const edges = this.graphData.links.map(link => ({
        source: link.source,
        target: link.target,
        relationship: link.relationship,
        value: link.value,
        lineStyle: {
          width: 1 + link.value / 2, // Make edge width proportional to evidence score
          opacity: 0.7
        }
      }));
      
      // Update chart option
      const newOption = { ...this.chartOption };
      newOption.series[0].data = nodes;
      newOption.series[0].edges = edges;
      
      this.chart.setOption(newOption);
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    resetGraph() {
      if (this.chart) {
        this.chart.dispatchAction({
          type: 'graphRoam',
          zoom: 1,
          dx: 0,
          dy: 0
        });
      }
    },
    updateForce(value) {
      if (this.chart) {
        const newOption = {
          series: [{
            force: {
              repulsion: 100 + value * 8,
              edgeLength: 50 + value
            }
          }]
        };
        this.chart.setOption(newOption);
      }
    }
  }
};
</script>

<style scoped>
.graph-container {
  flex: 1;
  position: relative;
  height: 100%;
}

.graph {
  width: 100%;
  height: 100%;
}

.legend {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.legend-color {
  width: 15px;
  height: 15px;
  margin-right: 5px;
  border-radius: 3px;
}

.controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 4px;
  z-index: 100;
  display: flex;
  align-items: center;
  min-width: 200px;
}

.controls .el-slider {
  margin-left: 10px;
  width: 120px;
}
</style>