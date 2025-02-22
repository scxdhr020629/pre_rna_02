<template>
  <d2-container class="page">
    <d2-page-cover>
      
      <!-- 图片插入 -->
      <div class="image-container">
        <img src="./image/model.png" alt="Deep Learning Framework" />
      </div>

      <!-- 介绍文本 -->
      <div class="intro-text">
        <p>We propose a deep learning framework (DLST-MDA) for identifying potential miRNA-drug associations (MDAs). Sequence and structural information of drugs are combined to leverage the intrinsic properties of miRNAs and drugs, rather than relying on interaction graphs. Experiments were performed on a manually constructed dataset and verified that DLST-MDA outperforms peers in drug-miRNA association prediction. In addition, case study results on antitumor drugs (paclitaxel, oxaliplatin, and docetaxel) are supported by published literature, highlighting the potential of the model for discovering novel MDAs.</p>
      </div>
      

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

   /* 图片容器样式 */
  .image-container {
    display: flex;
    justify-content: center;   /* 居中对齐 */
    align-items: center;
    margin-top: 30px;           /* 图片顶部与文字的间距 */
    margin-bottom: 20px;        /* 图片底部与文本之间的间距 */
  }

  .image-container img {
    max-width: 900px;            /* 设置最大宽度为容器的90% */
    // max-height: 437px;         /* 设置最大高度，保持比例 */
    width: auto;               /* 宽度自动调整，保持比例 */
    height: auto;              /* 高度自动调整，保持比例 */
  }

  /* 介绍文本样式 */
  .intro-text {
    font-size: 16px;
    color: #333;
    line-height: 1.6;
    margin-top: 20px;
    padding: 0 20px;
    text-align: center;
  }
}
</style>
