<template>
  <d2-container>
    <div class="about-content">
      <!-- Page Header -->
      <div class="page-header-container">
        <div class="page-header">
          <h1 class="title">Help Documentation</h1>
          <p class="subtitle">Comprehensive guide to using our RNA prediction platform</p>
        </div>
      </div>
      
      <div class="quick-nav">
        <h3>Quick Navigation</h3>
        <el-button-group>
          <el-button type="primary" size="small" icon="el-icon-document" @click="scrollToSection('overview')">Overview</el-button>
          <el-button type="primary" size="small" icon="el-icon-menu" @click="scrollToSection('features')">Features</el-button>
          <el-button type="primary" size="small" icon="el-icon-s-platform" @click="scrollToSection('getting-started')">Getting Started</el-button>
          <el-button type="primary" size="small" icon="el-icon-question" @click="scrollToSection('troubleshooting')">Troubleshooting</el-button>
        </el-button-group>
      </div>    
      <!-- Markdown documentation content -->
      <div class="doc-container">
        <d2-markdown :source="doc" highlight/>
      </div>
    </div>
  </d2-container>
</template>

<script>
import doc from './md/doc.md'

export default {
  name: 'help-documentation',
  data() {
    return {
      doc
    }
  },
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
/* Base variables for consistent scaling */
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --text-color: #2c3e50;
  --border-color: #dcdfe6;
  --background-color: #f8fafc;
  --shadow-color: rgba(0, 0, 0, 0.08);
}

/* Page content container */
.about-content {
  padding: 0.08rem 0 0.6rem;  /* Small top padding to maintain minimal space */
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  font-size: calc(0.85rem + 0.1vw);
  line-height: 1.5;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  animation: fadeInUp 0.6s ease-out; /* Added animation for page transition */
}

/* Page header container for full width effect */
.page-header-container {
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
  margin-top: 0;
  overflow: hidden;
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
  /* Use viewport units for responsive height that scales with screen size */
  min-height: 3.8rem;
  max-height: 5.5rem;
  width: 99.8%;
  margin-left: auto;
  margin-right: auto;
}

.title {
  /* Using rem and viewport width for responsive text sizing */
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
  /* Responsive font sizing that scales better across displays */
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

/* Page transition animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(1.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.doc-container {
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.quick-nav {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  
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

/* Responsive adjustments */
@media (min-width: 1440px) {
  .page-header {
    width: 99.8%;
  }
}

@media (max-width: 1200px) {
  .page-header {
    width: 99.6%;
  }
}

@media (max-width: 992px) {
  .about-content {
    padding: 0.08rem 0 0.6rem;
  }
  
  .page-header {
    width: 99.4%;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 0.5rem 0;
    width: 99%;
  }
}

@media (max-width: 576px) {
  .about-content {
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

/* For Firefox which handles rem differently */
@-moz-document url-prefix() {
  .about-content {
    font-size: calc(13.6px + 0.1vw);
  }
  
  .title {
    font-size: calc(24px + 0.5vw);
  }
  
  .subtitle {
    font-size: calc(11.2px + 0.2vw);
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