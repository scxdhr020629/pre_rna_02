<template>
  <d2-container class="page">
    <d2-page-cover>
      <!-- 主内容区布局 -->
      <div class="main-content">
        <!-- 左侧图片 -->
        <div class="image-section">
          <img src="./image/home2.jpg" alt="RNA Analysis Platform" @click="$open('https://github.com/scxdhr020629/pre_rna_02')" class="main-image" />
        </div>
        
        <!-- 右侧内容 -->
        <div class="content-section">
          <!-- 摘要文字 -->
          <div class="summary">
            <h2>RNA Structure Prediction Platform</h2>
            <p>
              Welcome to our advanced RNA sequence analysis and structure prediction platform. 
              This innovative tool leverages deep learning algorithms to analyze RNA sequences, 
              predict secondary structures, and provide comprehensive insights into RNA functionality. 
              Designed for researchers, bioinformaticians, and computational biologists, our platform 
              facilitates rapid analysis with high accuracy and intuitive visualization tools.
            </p>
          </div>
          
          <!-- 四宫格链接 -->
          <div class="grid-links">
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
      
      <!-- 原有的底部部分保持不变 -->
      <template slot="footer">
        <div class="btn-group">
          <span class="btn-group__btn" @click="$open('https://github.com/scxdhr020629/pre_rna_02')">Codes</span> |
          <span class="btn-group__btn" @click="$open('https://d2.pub/doc/d2-admin')">Documents</span> |
          <span class="btn-group__btn" @click="$open('https://juejin.im/user/57a48b632e958a006691b946/posts')">CSDN</span> |
          <el-popover :width="150" trigger="hover">
            <img src="./image/scxwx.jpg" style="width: 150px;">
            <span slot="reference" class="btn-group__btn btn-group__btn--link">
              <d2-icon name="weixin"/>
              WeChat
            </span>
          </el-popover>
        </div>
        <!-- <d2-badge/> -->
        <d2-help/>
      </template>
    </d2-page-cover>
  </d2-container>
</template>

<script>
import D2Badge from './components/d2-badge'
import D2Help from './components/d2-help'
import D2PageCover from './components/d2-page-cover'
export default {
  components: {
    D2Badge,
    D2Help,
    D2PageCover
  }
}
</script>

<style lang="scss" scoped>
.page {
  .logo {
    width: 120px;
  }
  
  .main-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 95%;
    max-width: 1200px;
    margin: 50px auto 30px;
    gap: 30px;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .image-section {
    flex: 1;
    max-width: 50%;
    
    @media (max-width: 768px) {
      max-width: 100%;
      margin-bottom: 20px;
    }
    
    .main-image {
      width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }
    }
  }
  
  .content-section {
    flex: 1;
    max-width: 50%;
    display: flex;
    flex-direction: column;
    gap: 25px;
    
    @media (max-width: 768px) {
      max-width: 100%;
    }
    
    .summary {
      h2 {
        color: $color-text-main;
        margin-bottom: 15px;
        font-size: 24px;
      }
      
      p {
        color: $color-text-sub;
        line-height: 1.6;
        text-align: justify;
        font-size: 14px;
      }
    }
    
    .grid-links {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 15px;
      margin-top: 10px;
      
      .grid-item {
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.1);
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        img {
          width: 40px;
          height: 40px;
          margin-bottom: 10px;
        }
        
        span {
          font-size: 14px;
          color: $color-text-sub;
        }
      }
    }
  }
  
  .btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    line-height: 12px;
    margin-top: 0px;
    margin-bottom: 20px;
    .btn-group__btn {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
      &.btn-group__btn--link {
        color: $color-primary;
      }
    }
  }
}
</style>