<template>
  <div class="d2-page-cover">
    <div class="d2-page-cover__logo">
      <slot/>
    </div>
    <p class="d2-page-cover__title">MDA {{$version}}</p>
    <!-- <p class="d2-page-cover__sub-title">优雅的中后台集成方案</p> -->
    <div class="intro-text">
        <p>We propose a deep learning framework (DLST-MDA) for identifying potential miRNA-drug associations (MDAs). Sequence and structural information of drugs are combined to leverage the intrinsic properties of miRNAs and drugs, rather than relying on interaction graphs. Experiments were performed on a manually constructed dataset and verified that DLST-MDA outperforms peers in drug-miRNA association prediction. In addition, case study results on antitumor drugs (paclitaxel, oxaliplatin, and docetaxel) are supported by published literature, highlighting the potential of the model for discovering novel MDAs.</p>
    </div>
    <p class="d2-page-cover__build-time">FINAL BUILD TIME {{$buildTime}}</p>
    <slot name="footer"/>
    <a target="blank" href="https://github.com/d2-projects/d2-admin">
      <img
        style="position: absolute; top: 0; right: 0; border: 0; width: 150px;"
        src="./image/darkblue@2x.png"
        alt="Fork me on GitHub">
    </a>
  </div>
</template>

<style lang="scss" scoped>
.d2-page-cover {
  @extend %full;
  @extend %unable-select;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  .d2-page-cover__logo {
    img {
      width: 200px;
    }
  }
  .d2-page-cover__title {
    margin: 0px;
    margin-bottom: 10px; /* 从20px减少到10px */
    font-weight: bold;
    color: $color-text-main;
  }
  .d2-page-cover__sub-title {
    margin: 0px;
    margin-bottom: 5px;
    color: $color-text-normal;
  }
  .d2-page-cover__build-time {
    margin: 0px;
    margin-bottom: 10px;
    font-size: 12px;
    color: $color-text-placehoder;
  }
  /* 介绍文本样式 */
  .intro-text {
    font-size: 16px;
    color: #333;
    line-height: 1.6;
    margin-top: 10px; /* 从20px减少到10px */
    padding: 0 20px;
    text-align: center;
  }
}
</style>