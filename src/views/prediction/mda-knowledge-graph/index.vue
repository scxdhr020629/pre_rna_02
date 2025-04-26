<template>
  <d2-container>
    <div class="app-container">
      <!-- Page Header -->
      <div class="page-header-container">
        <div class="page-header">
          <h1 class="title">Drug-miRNA Knowledge Graph Visualization</h1>
          <p class="subtitle">
            Explore drug-miRNA relationship networks, visualize complex association data
          </p>
        </div>
      </div>
      
      <div class="content">
        <div class="left-section">
          <div class="section-header">
            <i class="el-icon-s-data"></i>
            <span>Data Management</span>
          </div>
          
          <!-- File Upload Component -->
          <file-upload 
            @upload-success="handleUploadSuccess"
            @file-selected="handleFileSelected" 
          />
          
          <!-- Graph Stats -->
          <graph-stats :stats="stats" />
        </div>
        
        <div class="right-section">
          <div class="section-header">
            <i class="el-icon-connection"></i>
            <span>Knowledge Graph</span>
          </div>
          
          <!-- Knowledge Graph Component -->
          <knowledge-graph :graphData="graphData" ref="knowledgeGraph" />
        </div>
      </div>
      
      <div class="app-footer">
        <p>Drug-miRNA Knowledge Graph System © 2025</p>
      </div>
    </div>
  </d2-container>
</template>

<script>
import FileUpload from './components/FileUpload.vue';
import KnowledgeGraph from './components/KnowledgeGraph.vue';
import GraphStats from './components/GraphStats.vue';
import axios from 'axios';

export default {
  name: 'MdaKnowledgeGraph',
  components: {
    FileUpload,
    KnowledgeGraph,
    GraphStats
  },
  data() {
    return {
      graphData: {
        nodes: [],
        links: []
      },
      stats: {
        totalNodes: 0,
        totalEdges: 0,
        drugCount: 0,
        rnaCount: 0
      }
    };
  },
  created() {
    this.fetchGraphData();
  },
  methods: {
    fetchGraphData() {
      axios.get('http://localhost:8000/dj_api/email/knowledge-graph/get_graph/')
        .then(response => {
          // Convert data to match the format required for visualization
          this.processGraphData(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch graph data:', error);
          this.$message.error('Failed to load graph data');
        });
    },
    processGraphData(data) {
      // Convert API response to the format required by the graph component
      const nodes = data.nodes.map(node => ({
        id: node.node_id,
        name: node.name,
        type: node.node_type,
        symbolSize: node.node_type === 'drug' ? 30 : 20,
        category: node.node_type === 'drug' ? 0 : 1
      }));

      // Note: Your API returns 'relationships' instead of 'links'
      const links = data.relationships.map(rel => ({
        source: rel.source,
        target: rel.target,
        relationship: rel.relationship_type,
        value: rel.properties?.evidence_score || 0
      }));

      this.graphData = { nodes, links };
      
      // Update statistics
      this.updateStats();
    },
    handleUploadSuccess(response) {
      this.graphData = {
        nodes: response.nodes,
        links: response.links
      };
      this.stats = response.stats;
      this.$message.success('File uploaded and processed successfully');
    },
    updateStats() {
      this.stats = {
        totalNodes: this.graphData.nodes.length,
        totalEdges: this.graphData.links.length,
        drugCount: this.graphData.nodes.filter(node => node.type === 'drug').length,
        rnaCount: this.graphData.nodes.filter(node => node.type === 'rna').length
      };
    },
    handleFileSelected() {
      // Delay call to ensure DOM has been updated
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs.knowledgeGraph && this.$refs.knowledgeGraph.chart) {
            this.$refs.knowledgeGraph.resizeChart();
          }
        }, 200);
      });
    }
  }
};
</script>

<style>
/* Base variables for consistent scaling */
:root {
  --primary-color: #409eff;
  --primary-gradient: linear-gradient(135deg, #409eff, #67c23a);
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
  --border-radius: 12px;
  --transition-time: 0.3s;
  --message-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* Page content container */
.app-container {
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  font-size: calc(0.85rem + 0.1vw);
  line-height: 1.5;
  overflow-x: hidden; 
  animation: fadeInUp 0.6s ease-out;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
}

/* Page header container for full width effect */
.page-header-container {
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
  margin-top: 0;
  overflow: hidden;
  flex-shrink: 0;
}

/* Page header styling */
.page-header {
  text-align: center;
  padding: 0.5rem 0;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border-radius: 0.5rem;
  margin-bottom: 0.9rem;
  margin-top: 0;
  box-shadow: 0 0.25rem 0.9rem rgba(64, 158, 255, 0.1);
  position: relative;
  overflow: hidden;
  min-height: 3.8rem;
  width: 99.8%;
  margin-left: auto;
  margin-right: auto;
}

.title {
  font-size: calc(1.5rem + 0.5vw);
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  letter-spacing: 0.125rem;
  text-shadow: 0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  padding: 0 1rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.95);
  margin-top: 0.25rem;
  font-size: calc(0.7rem + 0.2vw);
  font-weight: 500;
  position: relative;
  z-index: 1;
  padding: 0 1rem;
}

/* Page title gradient effect */
.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 3s infinite;
}

/* Content layout */
.content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  padding: 20px;
  flex: 1;
  min-height: calc(100vh - 200px);
}

/* Section styling */
.left-section,
.right-section {
  background: #ffffff;
  border-radius: var(--border-radius);
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform var(--transition-time) ease,
    box-shadow var(--transition-time) ease;
}

.right-section {
  display: flex;
  flex-direction: column;
  min-height: 600px; /* Ensure right section has enough height */
}

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

.section-header i {
  font-size: 24px;
  margin-right: 12px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-header span {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

/* Add special styles for main area titles - longer underline */
.left-section > .section-header::after,
.right-section > .section-header::after {
  width: 140px; /* Increased from 80px to 140px, clearly differentiating main titles */
}

/* Footer */
.app-footer {
  display: flex;
  justify-content: center;
  padding: 12px 0;
  color: #909399;
  font-size: 14px;
  background: white;
  margin-top: 20px;
  border-top: 1px solid #f2f2f2;
}

/* Animations */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  20% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Override for KnowledgeGraph component */
.right-section .graph-container {
  flex: 1;
  min-height: 500px; /* Set minimum height instead of fixed calculated height */
  margin: -5px;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: #f8fafc;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .content {
    grid-template-columns: 1fr;
  }
  
  .right-section .graph-container {
    height: 600px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 0.5rem 0;
    width: 99%;
  }
  
  .content {
    padding: 10px;
    gap: 15px;
  }
  
  .left-section, .right-section {
    padding: 15px;
  }
}

@media (max-width: 576px) {
  .app-container {
    padding: 0.08rem 0 0.6rem;
  }
  
  .page-header {
    padding: 0.5rem 0;
    margin-bottom: 0.75rem;
    width: 98%;
  }
  
  .title {
    font-size: calc(1.3rem + 0.5vw);
    padding: 0 0.5rem;
  }
  
  .subtitle {
    font-size: calc(0.6rem + 0.2vw);
    margin-top: 0.25rem;
    padding: 0 0.5rem;
  }
}
</style>