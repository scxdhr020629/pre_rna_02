<template>
  <div class="graph-container">
    <div id="graphChart" ref="graphChart" class="graph"></div>
    
    <!-- Node Type Filter -->
    <div class="node-filter">
      <span class="filter-label">Filter Nodes:</span>
      <el-radio-group v-model="nodeFilter" size="small" @change="applyNodeFilter">
        <el-radio-button label="all">All</el-radio-button>
        <el-radio-button label="drug" class="drug-button">Drugs</el-radio-button>
        <el-radio-button label="rna" class="rna-button">miRNA</el-radio-button>
      </el-radio-group>
    </div>
    
    <!-- Legend -->
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color" style="background-color: #5470c6"></div>
        <span>Drugs</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background-color: #91cc75"></div>
        <span>miRNA</span>
      </div>
    </div>
    
    <!-- Controls -->
    <div class="controls">
      <el-button size="small" @click="resetGraph" type="primary">Reset View</el-button>
      <div class="force-control">
        <span class="slider-label">Force Strength:</span>
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
          text: 'Drug-RNA Interaction Network',
          subtext: 'Knowledge Graph Visualization',
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
                  Type: ${params.data.type === 'drug' ? 'Drug' : 'miRNA'}<br/>
                  ID: ${params.data.id}
                </div>
              `;
            } else {
              return `
                <div>
                  <strong>Relationship</strong><br/>
                  Type: ${params.data.relationship}<br/>
                  Evidence Score: ${params.data.value.toFixed(2)}
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
              { name: 'miRNA', itemStyle: { color: '#91cc75' } }
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
    
    // Add container size change listener
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(entries => {
        if (entries[0] && this.chart) {
          this.resizeChart();
        }
      });
      ro.observe(this.$refs.graphChart);
      this._resizeObserver = ro; // Save reference for cleanup
    }
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
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
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
        // Ensure container is visible before redrawing
        const chartDom = this.$refs.graphChart;
        if (chartDom && chartDom.offsetHeight > 0 && chartDom.offsetWidth > 0) {
          console.log('Redrawing chart, container size:', chartDom.offsetWidth, 'x', chartDom.offsetHeight);
          this.chart.resize();
          
          // Check edge count
          if (this.originalEdges && this.originalEdges.length > 0) {
            console.log(`Chart contains ${this.originalEdges.length} edge relationships`);
          }
        }
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
      
      this.$message.success('Graph view has been reset');
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
      
      // Apply filtering based on selection
      if (filter === 'all') {
        // Show all nodes and edges
        filteredNodes = this.originalNodes;
        filteredEdges = this.originalEdges;
      } else if (filter === 'drug') {
        // Get only drug nodes
        filteredNodes = this.originalNodes.filter(node => node.type === 'drug');
        
        // Get edges between these nodes (drug-to-drug connections, if any)
        const drugIds = new Set(filteredNodes.map(node => node.id));
        filteredEdges = this.originalEdges.filter(edge => 
          drugIds.has(edge.source) && drugIds.has(edge.target)
        );
      } else if (filter === 'rna') {
        // Get only RNA nodes
        filteredNodes = this.originalNodes.filter(node => node.type === 'rna');
        
        // Get edges between these nodes (RNA-to-RNA connections, if any)
        const rnaIds = new Set(filteredNodes.map(node => node.id));
        filteredEdges = this.originalEdges.filter(edge => 
          rnaIds.has(edge.source) && rnaIds.has(edge.target)
        );
      }
      
      // Update chart with filtered data
      this.chart.setOption({
        series: [{
          data: filteredNodes,
          edges: filteredEdges
        }]
      });
      
      // Provide user feedback
      this.$message({
        message: `Now showing ${filteredNodes.length} ${filter === 'all' ? '' : (filter === 'drug' ? 'Drug' : 'miRNA')} nodes`,
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

/* Override the primary button color to match the consistent theme */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409eff, #67c23a);
  border: none;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover),
:deep(.el-button--primary:focus) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  opacity: 0.95;
  border: none;
}
</style>
``` 