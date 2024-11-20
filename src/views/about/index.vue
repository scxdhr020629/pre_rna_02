<template>
  <d2-container>
    <template slot="header">About Us</template>

    <!-- Introduction content -->
    <div class="about-content">
      <el-row class="team-container" gutter={20}>
        <!-- Person 1 - Nan Sheng -->
        <el-col :span="6">
          <el-card class="team-card">
            <div class="card-body">
              <h3>Nan Sheng</h3>
              <p>Position: Team Member</p>
              <p>Email: <a href="mailto:xxx@jlu.edu.cn">xxx@jlu.edu.cn</a></p>
            </div>
          </el-card>
        </el-col>

        <!-- Person 2 - Yunzhi Liu -->
        <el-col :span="6">
          <el-card class="team-card">
            <div class="card-body">
              <h3>Yunzhi Liu</h3>
              <p>Position: Team Member</p>
              <p>Email: <a href="mailto:xxx@jlu.edu.cn">xxx@jlu.edu.cn</a></p>
            </div>
          </el-card>
        </el-col>

        <!-- Person 3 - Lei Wang -->
        <el-col :span="6">
          <el-card class="team-card">
            <div class="card-body">
              <h3>Lei Wang</h3>
              <p>Position: Team Member</p>
              <p>Email: <a href="mailto:xxx@jlu.edu.cn">xxx@jlu.edu.cn</a></p>
            </div>
          </el-card>
        </el-col>

        <!-- Person 4 - Chenxu Si -->
        <el-col :span="6">
          <el-card class="team-card">
            <div class="card-body">
              <h3>Chenxu Si</h3>
              <p>Position: Team Member</p>
              <p>Email: <a href="mailto:xxx@jlu.edu.cn">xxx@jlu.edu.cn</a></p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <template slot="footer">Footer</template>
  </d2-container>
</template>

<script>
export default {
  name: 'AboutUs'
}
</script>

<style scoped>
.about-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-container {
  width: 100%;
}

.team-card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  text-align: center;
}

.card-body h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 10px;
}

.card-body p {
  font-size: 16px;
  color: #666;
  margin: 5px 0;
}

.card-body a {
  color: #409EFF;
  text-decoration: none;
}

.card-body a:hover {
  text-decoration: underline;
}

.el-row {
  margin-top: 20px;
}
</style>
