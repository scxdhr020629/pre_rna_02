<template>
  <d2-container class="page">
    <d2-page-cover>
      <!-- <d2-icon-svg class="logo" name="d2-admin"/> -->
      <!-- 图片插入 -->
      <div class="image-container">
        <img src="./image/home1.jpg" alt="Deep Learning Framework" />
      </div>
      <template slot="footer">
        <div class="btn-group">
          <span class="btn-group__btn" @click="$open('https://github.com/d2-projects')">Codes</span> |
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
  
  // 修改图片容器样式：让图片铺满容器
  .image-container {
    width: 95%;
    max-width: 1000px;
    margin: 80px auto 30px;
    padding: 0; // 移除内边距，让图片完全铺满容器
    border-radius: 4px; // 减小圆角
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden; // 确保圆角效果不被图片超出部分打破
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    img {
      width: 100%;
      height: auto;
      border-radius: 0; // 移除图片圆角，让其紧贴容器边缘
      display: block;
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