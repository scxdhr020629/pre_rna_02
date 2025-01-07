<template>
  <d2-container>
    <template slot="header">Drug-MiRNA Association Query</template>
    
    <div class="content">
      <!-- 输入药物名称 -->
      <el-input
        v-model="drugName"
        placeholder="Please enter drug sequence"
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
        Search
      </el-button>

      <!-- 显示相关的mRNA -->
      <div v-if="mrnaList.length > 0" class="result-container">
        <el-card v-for="(mrna, index) in mrnaList" :key="index" class="mrna-card">
          <div class="mrna-info">
            <span><strong>{{ index + 1 }}. RNA_ID: </strong>{{ mrna.RNA_ID }}</span><br />
            <span><strong>Sequence: </strong>{{ mrna.Sequence }}</span><br />
            <span><strong>Probability: </strong>{{ mrna.Probability }}</span>
          </div>
        </el-card>
      </div>

      <!-- 如果没有数据或还没查询 -->
      <div v-else class="no-result">
        <p>Please enter the drug sequence and click on search.</p>
      </div>
    </div>
  </d2-container>
</template>

<script>
export default {
  name: 'Prediction1',
  data() {
    return {
      drugName: '',  // 用户输入的drug sequence
      mrnaList: [],  // 存储返回的mRNA数据
      loading: false,  // 加载状态
    };
  },
  methods: {
    async fetchMRNA() {
      if (!this.drugName) {
        this.$message.warning('Please enter the drug sequence');
        return;
      }
      this.loading = true;

      try {
        console.log('drug_sequence:', this.drugName);  // 打印 drugName 查看是否正确

        // 调用 get_rnas API，传入 drugName 作为 drug_sequence
        const response = await this.$api.get_rnas({ drug_sequence: this.drugName });
        
        // 直接将返回的 RNA 数据赋值给 mrnaList
        
        this.mrnaList = response[1].data.data;  // 假设 API 直接返回了 RNA 数据数组
        console.log('vue 中的数据')
        console.log(response)
        console.log(response[1].msg)
        console.log(response[1].data)
        console.log(response[1].data.data[1])
        console.log(this.mrnaList)
      } catch (error) {
        console.error('Request failed', error);  // 打印错误信息
        this.$message.error('Request failed. Please try again later.');
      } finally {
        this.loading = false;
      }
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
  border: 1px solid #ddd;
}

.mrna-info {
  font-size: 14px;
  color: #333;
}

.no-result {
  color: #888;
  font-size: 16px;
}
</style>
