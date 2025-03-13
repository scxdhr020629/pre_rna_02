
<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <h1 class="title">Help Documentation</h1>
        <p class="subtitle">Last Updated: {{ currentTime }}</p>
      </div>
    </template>
    
    <!-- Markdown documentation content -->
    <div class="doc-container">
      <d2-markdown :source="doc" highlight/>
    </div>
    
    <!-- Quick navigation section -->
    <div class="quick-nav">
      <h3>Quick Navigation</h3>
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-document" @click="scrollToSection('overview')">Overview</el-button>
        <el-button type="primary" size="small" icon="el-icon-menu" @click="scrollToSection('features')">Features</el-button>
        <el-button type="primary" size="small" icon="el-icon-s-platform" @click="scrollToSection('getting-started')">Getting Started</el-button>
        <el-button type="primary" size="small" icon="el-icon-question" @click="scrollToSection('troubleshooting')">Troubleshooting</el-button>
      </el-button-group>
    </div>
  </d2-container>
</template>

<script>
import doc from './md/doc.md'

export default {
  name: 'help-documentation',
  data() {
    return {
      doc,
      currentTime: '2025-03-13 07:51:53'
    }
  },
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    updateTimestamp() {
      this.currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
  },
  mounted() {
    // Add IDs to headings for navigation
    this.$nextTick(() => {
      const headings = document.querySelectorAll('h2');
      headings.forEach(heading => {
        const id = heading.textContent.toLowerCase().replace(/\s+/g, '-');
        heading.id = id;
      });
    });
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.title {
  font-size: 2.4em;
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
}

.subtitle {
  color: rgba(255, 255, 255, 0.95);
  margin-top: 8px;
  font-size: 1.1em;
  font-weight: 500;
}

.doc-container {
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.quick-nav {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  margin-bottom: 20px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #303133;
    font-size: 16px;
  }
  
  .el-button-group {
    margin-top: 10px;
  }
}

/* Additional styles for markdown content */
:deep(.markdown-body) {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  
  h1, h2, h3 {
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  
  table {
    margin: 20px 0;
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 8px 12px;
      border: 1px solid #dfe2e5;
    }
    
    th {
      background-color: #f6f8fa;
    }
  }
  
  code {
    background-color: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
  
  pre {
    background-color: #f6f8fa;
    border-radius: 3px;
    padding: 16px;
    overflow: auto;
  }
}
</style>