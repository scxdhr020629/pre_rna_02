<template>
  <d2-container class="page">
    <!-- <d2-icon-svg class="logo" name="d2-admin"/>
      <div class="intro-text">
        <p>We propose a deep learning framework (DLST-MDA) for identifying potential miRNA-drug associations (MDAs). Sequence and structural information of drugs are combined to leverage the intrinsic properties of miRNAs and drugs, rather than relying on interaction graphs. Experiments were performed on a manually constructed dataset and verified that DLST-MDA outperforms peers in drug-miRNA association prediction. In addition, case study results on antitumor drugs (paclitaxel, oxaliplatin, and docetaxel) are supported by published literature, highlighting the potential of the model for discovering novel MDAs.</p>
      </div> -->
    <d2-page-cover>
      <!-- <d2-icon-svg class="logo" name="d2-admin"/> -->
      <div class="intro-text">
        <p>We propose a deep learning framework (DLST-MDA) for identifying potential miRNA-drug associations (MDAs). Sequence and structural information of drugs are combined to leverage the intrinsic properties of miRNAs and drugs, rather than relying on interaction graphs. Experiments were performed on a manually constructed dataset and verified that DLST-MDA outperforms peers in drug-miRNA association prediction. In addition, case study results on antitumor drugs (paclitaxel, oxaliplatin, and docetaxel) are supported by published literature, highlighting the potential of the model for discovering novel MDAs.</p>
      </div>
      <!-- <template slot="footer">
        <div class="btn-group">
          <span class="btn-group__btn" @click="$open('https://github.com/d2-projects')">开源组织</span> |
          <span class="btn-group__btn" @click="$open('https://d2.pub/zh/doc/d2-admin')">文档</span> |
          <span class="btn-group__btn" @click="$open('https://github.com/d2-projects/d2-admin-start-kit')">简化版</span> |
          <span class="btn-group__btn" @click="$open('https://juejin.im/user/57a48b632e958a006691b946/posts')">掘金</span> |
          <el-popover :width="172" trigger="hover">
            <p class="d2-mt-0 d2-mb-10">今日前端</p>
            <img src="./image/qr@2x.png" style="width: 172px;">
            <span slot="reference" class="btn-group__btn btn-group__btn--link">
              <d2-icon name="weixin"/>
              微信公众号
            </span>
            <p style="font-size: 12px; margin-top: 0px; margin-bottom: 0px;">
              官方公众号，主要推送前端技术类文章、框架资源、学习教程，以及 D2 系列项目更新信息
            </p>
          </el-popover>
        </div>
        <d2-badge/>
        <d2-help/>
      </template> -->
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

  /* 新增样式 */
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
