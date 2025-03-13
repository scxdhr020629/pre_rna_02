<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <h1 class="title">Help Documentation</h1>
        <p class="subtitle">Last Updated: {{ currentTime }}</p>
      </div>
    </template>

  </d2-container>
</template>



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
</style>