<template>
  <d2-container class="d2-page" fluid>
    <div class="image-container">
      <img src="./image/DNA3.png" alt="Deep Learning Framework" />
    </div>
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
/* 通过d2-container的fluid属性使容器宽度充满视口 */
.d2-page {
  height: 100vh; /* 确保容器填满整个视口的高度 */
  margin: 0;     /* 去除可能的外边距 */
  padding: 0;    /* 去除可能的内边距 */
}

/* 图片容器样式 */
.image-container {
  width: 100%;                    /* 宽度填满父容器 */
  height: 100vh;                  /* 高度填满视口 */
  display: flex;
  justify-content: center;        /* 水平居中对齐 */
  align-items: center;            /* 垂直居中对齐 */
  position: absolute;             /* 使容器绝对定位，确保覆盖整个页面 */
  top: 0;
  left: 0;
  overflow: hidden;               /* 防止图片溢出 */
}

/* 图片样式 */
.image-container img {
  width: 100vw;                   /* 图片宽度填满视口 */
  height: 100vh;                  /* 图片高度填满视口 */
  object-fit: cover;              /* 保持宽高比填充容器，可能裁剪 */
}
</style>
