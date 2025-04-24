<template>
  <div id="app">
    <h1>知识图谱可视化</h1>
    <div class="container">
      <div class="sidebar">
        <file-upload @upload-success="handleUploadSuccess" />
        <graph-stats :stats="stats" />
      </div>
      <knowledge-graph :graphData="graphData" />
    </div>
  </div>
</template>

<script>
import FileUpload from './components/FileUpload.vue';
import KnowledgeGraph from './components/KnowledgeGraph.vue';
import GraphStats from './components/GraphStats.vue';
import axios from 'axios';

export default {
  name: 'App',
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
          // 转换数据以匹配可视化所需的格式
          this.processGraphData(response.data);
        })
        .catch(error => {
          console.error('获取图谱数据失败:', error);
          this.$message.error('加载图谱数据失败');
        });
    },
    processGraphData(data) {
      // 将API响应转换为图形组件所需的格式
      const nodes = data.nodes.map(node => ({
        id: node.node_id,
        name: node.name,
        type: node.node_type,
        symbolSize: node.node_type === 'drug' ? 30 : 20,
        category: node.node_type === 'drug' ? 0 : 1
      }));

      // 注意：您的API返回的是'relationships'而不是'links'
      const links = data.relationships.map(rel => ({
        source: rel.source,
        target: rel.target,
        relationship: rel.relationship_type,
        value: rel.properties?.evidence_score || 0
      }));

      this.graphData = { nodes, links };
      
      // 更新统计信息
      this.updateStats();
    },
    handleUploadSuccess(response) {
      this.graphData = {
        nodes: response.nodes,
        links: response.links
      };
      this.stats = response.stats;
      this.$message.success('文件上传并处理成功');
    },
    updateStats() {
      this.stats = {
        totalNodes: this.graphData.nodes.length,
        totalEdges: this.graphData.links.length,
        drugCount: this.graphData.nodes.filter(node => node.type === 'drug').length,
        rnaCount: this.graphData.nodes.filter(node => node.type === 'rna').length
      };
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}

.container {
  display: flex;
  width: 100%;
  height: calc(100vh - 100px);
}

.sidebar {
  width: 300px;
  padding: 20px;
  border-right: 1px solid #eee;
  overflow-y: auto;
}

h1 {
  margin-bottom: 20px;
}
</style>