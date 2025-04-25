<template>
  <div class="graph-container">
    <div id="graphChart" ref="graphChart" class="graph"></div>
    
    <!-- Node Type Filter -->
    <div class="node-filter">
      <span class="filter-label">筛选节点:</span>
      <el-radio-group v-model="nodeFilter" size="small" @change="applyNodeFilter">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="drug" class="drug-button">药物</el-radio-button>
        <el-radio-button label="rna" class="rna-button">RNA</el-radio-button>
      </el-radio-group>
    </div>
    
    <!-- Legend -->
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: #5470c6"></div>
        <span>药物</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #91cc75"></div>
        <span>RNA</span>
      </div>
    </div>
    
    <!-- Controls -->
    <div class="controls">
      <el-button size="small" @click="resetGraph" type="primary">重置视图</el-button>
      <div class="force-control">
        <span class="slider-label">力度:</span>
        <el-slider v-model="forceStrength" :min="1" :max="100" @change="updateForce"></el-slider>
      </div>
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
      nodeFilter: 'all', // Default to showing all nodes
      chartOption: {
        title: {
          text: '药物-RNA交互网络',
          subtext: '知识图谱可视化',
          left: 'center',
          textStyle: {
            color: '#2c3e50'
          },
          subtextStyle: {
            color: '#5e6d82'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (params.dataType === 'node') {
              return `
                <div>
                  <strong>${params.data.name}</strong><br/>
                  类型: ${params.data.type === 'drug' ? '药物' : 'RNA'}<br/>
                  ID: ${params.data.id}
                </div>
              `;
            } else {
              return `
                <div>
                  <strong>关联关系</strong><br/>
                  类型: ${params.data.relationship}<br/>
                  证据分数: ${params.data.value.toFixed(2)}
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
            draggable: true, // Keep this to ensure nodes can be dragged
            roam: true,
            force: {
              repulsion: 500,
              edgeLength: 150
            },
            nodeScaleRatio: 0.6,
            selectedMode: 'single',
            lineStyle: {
              color: 'source',
              curveness: 0.2 // Changed from 0 to 0.2 to add curvature
            },
            edgeSymbol: ['none', 'none'], // Remove arrow symbols
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
      },
      originalNodes: [], // Store original node list for filtering
      originalEdges: [] // Store original edge list for filtering
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
        },
        draggable: true // Ensure each node is draggable
      }));
      
      const edges = this.graphData.links.map(link => ({
        source: link.source,
        target: link.target,
        relationship: link.relationship,
        value: link.value,
        lineStyle: {
          width: 1 + link.value / 2, // Make edge width proportional to evidence score
          opacity: 0.7,
          curveness: 0.2 // Changed from 0 to 0.2 for curved lines
        },
        symbol: ['none', 'none'] // No arrow symbols
      }));
      
      // Store original data for filtering
      this.originalNodes = JSON.parse(JSON.stringify(nodes));
      this.originalEdges = JSON.parse(JSON.stringify(edges));
      
      // Update chart option - preserve all options including draggable
      const newOption = { ...this.chartOption };
      newOption.series[0].data = nodes;
      newOption.series[0].edges = edges;
      newOption.series[0].draggable = true; // Explicitly set draggable
      
      this.chart.setOption(newOption);
      
      // Store the initial state for reset
      this.initialOption = JSON.parse(JSON.stringify(newOption));
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    resetGraph() {
      if (!this.chart) return;
      
      // Reset node filter
      this.nodeFilter = 'all';
      
      // First, reset zoom and position
      this.chart.dispatchAction({
        type: 'restore'
      });
      
      // Then, reset the force layout
      const option = {
        series: [{
          force: {
            // Reset to default force values
            repulsion: 500,
            edgeLength: 150,
            layoutAnimation: true,
            initLayout: 'circular'
          },
          data: this.originalNodes,
          edges: this.originalEdges
        }]
      };
      
      // Apply the reset
      this.chart.setOption(option);
      
      // Reset the forceStrength slider
      this.forceStrength = 50;
      
      // Force a redraw
      this.chart.resize();
      
      this.$message.success('图谱视图已重置');
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
    },
    applyNodeFilter(filter) {
      if (!this.chart || !this.originalNodes) return;
      
      let filteredNodes = [];
      let filteredEdges = [];
      
      // 基于选择应用筛选
      if (filter === 'all') {
        // 显示所有节点和边
        filteredNodes = this.originalNodes;
        filteredEdges = this.originalEdges;
      } else if (filter === 'drug') {
        // 只获取药物节点
        filteredNodes = this.originalNodes.filter(node => node.type === 'drug');
        
        // 获取这些节点之间的边（药物到药物的连接，如果有的话）
        const drugIds = new Set(filteredNodes.map(node => node.id));
        filteredEdges = this.originalEdges.filter(edge => 
          drugIds.has(edge.source) && drugIds.has(edge.target)
        );
      } else if (filter === 'rna') {
        // 只获取RNA节点
        filteredNodes = this.originalNodes.filter(node => node.type === 'rna');
        
        // 获取这些节点之间的边（RNA到RNA的连接，如果有的话）
        const rnaIds = new Set(filteredNodes.map(node => node.id));
        filteredEdges = this.originalEdges.filter(edge => 
          rnaIds.has(edge.source) && rnaIds.has(edge.target)
        );
      }
      
      // 更新图表，使用筛选后的数据
      this.chart.setOption({
        series: [{
          data: filteredNodes,
          edges: filteredEdges
        }]
      });
      
      // 提供用户反馈
      this.$message({
        message: `已筛选显示${filteredNodes.length}个${filter === 'all' ? '' : (filter === 'drug' ? '药物' : 'RNA')}节点`,
        type: 'success',
        duration: 2000
      });
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

/* Node filter styling */
.node-filter {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 4px;
  z-index: 100;
  display: flex;
  align-items: center;
}

.filter-label {
  margin-right: 10px;
  color: #606266;
  font-weight: 500;
}

/* Custom styles for radio buttons to match node colors */
.node-filter :deep(.el-radio-group) .el-radio-button:not(:last-child) .el-radio-button__inner {
  border-right: 1px solid #dcdfe6;
}

.node-filter :deep(.drug-button.is-active) .el-radio-button__inner {
  background-color: #5470c6 !important;
  border-color: #5470c6 !important;
  box-shadow: -1px 0 0 0 #5470c6 !important;
}

.node-filter :deep(.rna-button.is-active) .el-radio-button__inner {
  background-color: #91cc75 !important;
  border-color: #91cc75 !important;
  box-shadow: -1px 0 0 0 #91cc75 !important;
}

/* Legend styling */
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

/* Controls styling */
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

.force-control {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.slider-label {
  margin-right: 10px;
  color: #606266;
}

.controls .el-slider {
  margin-left: 10px;
  width: 120px;
}

/* Override the primary button color to match the graph theme */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #5470c6, #91cc75);
  border-color: #5470c6;
}

:deep(.el-button--primary:hover),
:deep(.el-button--primary:focus) {
  background: linear-gradient(135deg, #5470c6, #91cc75);
  opacity: 0.9;
  border-color: #5470c6;
}
</style>