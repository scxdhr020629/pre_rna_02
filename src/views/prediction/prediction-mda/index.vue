<template>
  <d2-container>
    <template slot="header">药物与mRNA关联查询</template>
    
    <div class="content">
      <!-- 输入药物名称 -->
      <el-input
        v-model="drugName"
        placeholder="请输入药物名称"
        clearable
        class="input-field"
      ></el-input>
      
      <!-- 查询按钮 -->
      <el-button
        type="primary"
        :loading="loading"
        @click="fetchMRNA"
        class="query-button"
      >
        查询相关mRNA
      </el-button>

      <!-- 显示相关的mRNA -->
      <div v-if="mrnaList.length > 0" class="result-container">
        <el-card v-for="(mrna, index) in mrnaList" :key="index" class="mrna-card">
          <div class="mrna-info">
            <span>{{ index + 1 }}. {{ mrna }}</span>
          </div>
        </el-card>
      </div>

      <!-- 如果没有数据或还没查询 -->
      <!-- 爆红 -->
      <!-- 这 loading 是个啥 -->
      <!-- <div v-else class="no-result" v-if="!loading">
        <p>请输入药物名称并点击查询。</p>
      </div> -->
      <div v-else class="no-result" >
        <p>请输入药物名称并点击查询。</p>
      </div>
    </div>
  </d2-container>
</template>

<script>
export default {
  name: 'Prediction1',
  data() {
    return {
      drugName: '',
      mrnaList: [],
      loading: false,
    };
  },
  methods: {
    fetchMRNA() {
      if (!this.drugName) {
        this.$message.warning('请先输入药物名称');
        return;
      }
      this.loading = true;

      // 模拟一个API请求，替换为真实接口调用
      setTimeout(() => {
        // 假设返回的数据是药物相关的mRNA
        this.mrnaList = [
          'mRNA1: Example 1',
          'mRNA2: Example 2',
          'mRNA3: Example 3',
          'mRNA4: Example 4',
          'mRNA5: Example 5',
        ];
        this.loading = false;
      }, 1000);
    },
  },
};
</script>

<style scoped>
/* 页面整体样式 */
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.input-field {
  width: 300px;
  margin-bottom: 20px;
}

.query-button {
  width: 300px;
  margin-bottom: 20px;
}

.result-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mrna-card {
  width: 300px;
  margin: 10px 0;
  padding: 10px;
}

.mrna-info {
  font-size: 16px;
  color: #333;
}

.no-result {
  color: #888;
  font-size: 16px;
}
</style>
