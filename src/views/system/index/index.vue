<template>
  <d2-container type="card">
    <div class="about-content">
      <!-- Page Header -->
      <div class="page-header-container">
        <div class="page-header">
          <h1 class="title">MDA</h1>
          <p class="subtitle">miRNA-Drug Association Prediction Platform</p>
        </div>
      </div>
      
      <div class="home-layout">
        <!-- 左侧图片 -->
        <div class="left-panel">
          <img 
            src="./image/home2.jpg" 
            alt="RNA Analysis Platform" 
            @click="$open('https://github.com/scxdhr020629/pre_rna_02')" 
            class="main-image"
          />
        </div>
        
        <!-- 右侧内容 -->
        <div class="right-panel">
          <h2 class="title">RNA Structure Prediction Platform</h2>
          <p class="description">
            Welcome to our advanced RNA sequence analysis and structure prediction platform. 
            This innovative tool leverages deep learning algorithms to analyze RNA sequences, 
            predict secondary structures, and provide comprehensive insights into RNA functionality. 
            Designed for researchers, bioinformaticians, and computational biologists, our platform 
            facilitates rapid analysis with high accuracy and intuitive visualization tools.
          </p>
          
          <!-- 四宫格链接 -->
          <div class="grid-box">
            <div class="grid-item" @click="$open('https://github.com/scxdhr020629/pre_rna_02')">
              <img src="./image/icon-github.svg" alt="GitHub">
              <span>Source Code</span>
            </div>
            <div class="grid-item" @click="$open('https://www.nature.com/subjects/rna')">
              <img src="./image/icon-research.svg" alt="Research">
              <span>Research</span>
            </div>
            <div class="grid-item" @click="$open('https://d2.pub/doc/d2-admin')">
              <img src="./image/icon-docs.svg" alt="Documentation">
              <span>Docs</span>
            </div>
            <div class="grid-item" @click="$open('https://www.rcsb.org/')">
              <img src="./image/icon-database.svg" alt="Database">
              <span>Database</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部区域 -->
      <div class="footer-container">
        <!-- 底部链接区 -->
        <div class="footer-links">
          <span class="link-item" @click="$open('https://github.com/scxdhr020629/pre_rna_02')">Codes</span>
          <span class="separator">|</span>
          <span class="link-item" @click="$open('https://d2.pub/doc/d2-admin')">Documents</span>
          <span class="separator">|</span>
          <span class="link-item" @click="$open('https://juejin.im/user/57a48b632e958a006691b946/posts')">CSDN</span>
          <span class="separator">|</span>
          <el-popover :width="150" trigger="hover">
            <img src="./image/scxwx.jpg" style="width: 150px;">
            <span slot="reference" class="link-item special">
              <d2-icon name="weixin"/>
              WeChat
            </span>
          </el-popover>
        </div>
        
        <!-- 版权信息 -->
        <div class="copyright-section">
          <p class="free-access-notice">This website is free and open to all users and there is no login requirement.</p>
          <p class="copyright-text">© Copyright 2025, Key Laboratory of Symbolic Computation and Knowledge Engineering of Ministry of Education, Jilin University</p>
        </div>
      </div>
    </div>
  </d2-container>
</template>

<script>
import D2Help from './components/d2-help'

export default {
  components: {
    D2Help
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

.home-layout {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 10px 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.left-panel {
  width: 55%;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  .main-image {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }
  }
}

.right-panel {
  width: 45%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  .title {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 5px;
    color: $color-text-main;
  }
  
  .description {
    font-size: 14px;
    line-height: 1.5;
    color: $color-text-sub;
    margin: 0;
  }
  
  .grid-box {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-top: 5px;
    
    .grid-item {
      background-color: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 6px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
      
      img {
        width: 32px;
        height: 32px;
        margin-bottom: 8px;
      }
      
      span {
        font-size: 13px;
        color: $color-text-sub;
      }
    }
  }
}

/* 整合底部区域 */
.footer-container {
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
  
  .link-item {
    font-size: 13px;
    color: $color-text-sub;
    padding: 0 10px;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
      color: $color-text-main;
    }
    
    &.special {
      color: $color-primary;
    }
  }
  
  .separator {
    color: $color-text-placehoder;
  }
}

/* 版权信息样式 */
.copyright-section {
  .free-access-notice {
    font-size: 13px;
    color: $color-text-sub;
    margin-bottom: 4px;
  }
  
  .copyright-text {
    font-size: 12px;
    color: $color-text-placehoder;
    margin: 0;
  }
}

/* Responsive adjustments for the header */
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
</style>