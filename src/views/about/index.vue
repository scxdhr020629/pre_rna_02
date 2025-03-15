<template>
  <d2-container>
    <template slot="header">
      <div class="page-header">
        <h1 class="title">About Our Team</h1>
        <p class="subtitle">Meet the experts behind our RNA prediction technology</p>
      </div>
    </template>

    <div class="about-content">
      <!-- Project Introduction -->
      <div class="section project-intro">
        <h2>Our Mission</h2>
        <p>
          We are dedicated to advancing RNA structure prediction through innovative computational approaches.
          Our tools help researchers understand RNA function and enable breakthroughs in areas like drug discovery,
          genetic engineering, and disease treatment.
        </p>
      </div>

      <!-- Team Section -->
      <div class="section team-section">
        <h2>Our Team</h2>
        
        <el-row :gutter="30" class="team-container">
          <!-- Team Member 1 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="/static/images/avatars/member1.png" alt="Nan Sheng" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Nan Sheng</h3>
                <div class="position">Lead Researcher</div>
                <div class="divider"></div>
                <p class="bio">Specialized in computational biology with expertise in RNA folding algorithms.</p>
                <div class="contact">
                  <el-tooltip content="Email" placement="top">
                    <a href="mailto:shengnan@jlu.edu.cn"><i class="el-icon-message"></i></a>
                  </el-tooltip>
                  <el-tooltip content="GitHub" placement="top">
                    <a href="https://github.com/username" target="_blank"><i class="el-icon-share"></i></a>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-col>

          <!-- Team Member 2 - Fixed alignment issue -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="/static/images/avatars/member2.png" alt="Yunzhi Liu" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Yunzhi Liu</h3>
                <div class="position">Machine Learning Specialist</div>
                <div class="divider"></div>
                <p class="bio">Focuses on developing AI models for accurate RNA secondary structure prediction.</p>
                <div class="contact">
                  <el-tooltip content="Email" placement="top">
                    <a href="mailto:liuyunzhi@jlu.edu.cn"><i class="el-icon-message"></i></a>
                  </el-tooltip>
                  <el-tooltip content="GitHub" placement="top">
                    <a href="https://github.com/username" target="_blank"><i class="el-icon-share"></i></a>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-col>

          <!-- Team Member 3 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="/static/images/avatars/member3.png" alt="Lei Wang" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Lei Wang</h3>
                <div class="position">Algorithm Developer</div>
                <div class="divider"></div>
                <p class="bio">Expert in optimization algorithms and data structures for RNA analysis.</p>
                <div class="contact">
                  <el-tooltip content="Email" placement="top">
                    <a href="mailto:wanglei@jlu.edu.cn"><i class="el-icon-message"></i></a>
                  </el-tooltip>
                  <el-tooltip content="GitHub" placement="top">
                    <a href="https://github.com/username" target="_blank"><i class="el-icon-share"></i></a>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-col>

          <!-- Team Member 4 -->
          <el-col :xs="24" :sm="12" :md="6" :lg="6" class="team-col">
            <div class="team-card">
              <div class="member-avatar">
                <img src="/static/images/avatars/member4.png" alt="Chenxu Si" onerror="this.src='/static/images/avatars/default.png'">
              </div>
              <div class="member-info">
                <h3>Chenxu Si</h3>
                <div class="position">Frontend Developer</div>
                <div class="divider"></div>
                <p class="bio">Specializes in creating intuitive interfaces for complex scientific applications.</p>
                <div class="contact">
                  <el-tooltip content="Email" placement="top">
                    <a href="mailto:sicx24@jlu.edu.cn"><i class="el-icon-message"></i></a>
                  </el-tooltip>
                  <el-tooltip content="GitHub" placement="top">
                    <a href="https://github.com/scxdhr020629" target="_blank"><i class="el-icon-share"></i></a>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- Lab Information -->
      <div class="section lab-info">
        <h2>Our Laboratory</h2>
        <div class="lab-content">
          <div class="lab-text">
            <p>
              Our research is conducted at Jilin University's Advanced Computational Biology Laboratory. 
              With state-of-the-art computing resources and interdisciplinary collaboration, 
              we're pushing the boundaries of RNA structure prediction.
            </p>
            <el-button type="primary" @click="showContactDialog">Contact Us</el-button>
          </div>
          <div class="lab-image">
            <img src="/static/images/lab.jpg" alt="Our Laboratory" onerror="this.style.display='none'">
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="Contact Information"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="contact-dialog">
        <p><i class="el-icon-location"></i> School of Life Sciences, Jilin University, Changchun, China</p>
        <p><i class="el-icon-phone"></i> +86 XXX-XXXX-XXXX</p>
        <p><i class="el-icon-message"></i> rna-pred@jlu.edu.cn</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Close</el-button>
      </span>
    </el-dialog>

    <template slot="footer">
      <div class="page-footer">
        <p>© {{ currentYear }} RNA Structure Prediction Team - Jilin University</p>
      </div>
    </template>
  </d2-container>
</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      dialogVisible: false,
      currentYear: new Date().getFullYear()
    }
  },
  methods: {
    showContactDialog() {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --text-color: #2c3e50;
  --border-color: #dcdfe6;
  --background-color: #f8fafc;
  --shadow-color: rgba(0, 0, 0, 0.08);
}

/* 页面标题样式 - 更新为与Email Service匹配的样式 */
.page-header {
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.1);
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
  position: relative;
  z-index: 1;
}

.subtitle {
  color: rgba(255, 255, 255, 0.95);
  margin-top: 8px;
  font-size: 1.1em;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

/* 页面标题光效动画 */
.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  20% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.about-content {
  padding: 20px 10px;
  animation: fadeInUp 0.6s ease-out;
}

.section {
  margin-bottom: 50px;
}

.section h2 {
  font-size: 26px;
  color: #2c3e50;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
  text-align: center;
}

.section h2:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #409EFF;
}

.project-intro p {
  font-size: 16px;
  line-height: 1.8;
  color: #34495e;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.team-container {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
}

.team-col {
  margin-bottom: 30px;
  display: flex; /* 解决第二个元素不对齐的问题 */
}

.team-card {
  height: 100%; /* 确保卡片高度一致 */
  width: 100%; /* 确保卡片宽度占满整个列 */
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.member-avatar {
  height: 180px;
  overflow: hidden;
  position: relative;
  background: #f0f3f7;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  padding: 20px;
  flex-grow: 1; /* 让信息区域自动填充剩余空间 */
  display: flex;
  flex-direction: column;
}

.member-info h3 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0 0 5px;
}

.position {
  color: #409EFF;
  font-size: 14px;
  font-weight: 600;
}

.divider {
  margin: 15px 0;
  width: 40px;
  height: 2px;
  background: #eee;
}

.bio {
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 15px;
  flex-grow: 1; /* 让简介占据剩余空间 */
}

.contact {
  display: flex;
  justify-content: flex-start;
  gap: 15px;
}

.contact a {
  color: #7f8c8d;
  font-size: 18px;
  transition: color 0.2s;
}

.contact a:hover {
  color: #409EFF;
}

.lab-content {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.lab-text {
  flex: 1;
  min-width: 300px;
}

.lab-text p {
  font-size: 16px;
  line-height: 1.8;
  color: #34495e;
  margin-bottom: 20px;
}

.lab-image {
  flex: 1;
  min-width: 300px;
}

.lab-image img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.contact-dialog {
  padding: 10px;
}

.contact-dialog p {
  font-size: 16px;
  margin: 15px 0;
  display: flex;
  align-items: center;
}

.contact-dialog i {
  margin-right: 10px;
  color: #409EFF;
}

.page-footer {
  text-align: center;
  color: #7f8c8d;
  font-size: 14px;
}

@media (max-width: 768px) {
  .lab-content {
    flex-direction: column;
  }
  
  .team-card {
    margin-bottom: 20px;
  }
}

/* 页面内容载入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>