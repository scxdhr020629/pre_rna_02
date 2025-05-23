<template>
  <div class="panel-search" flex="dir:top">
    <div class="panel-search__input-group" flex-box="0" flex="dir:top main:center cross:center" @click.self="handlePanelClick">
      <d2-icon-svg class="panel-search__logo" name="d2-admin-text"/>
      <el-autocomplete
        class="panel-search__input"
        ref="input"
        v-model="searchText"
        suffix-icon="el-icon-search"
        placeholder="search page"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        :clearable="true"
        @keydown.esc.native="handleEsc"
        @select="handleSelect">
        <d2-panel-search-item slot-scope="{ item }" :item="item"/>
      </el-autocomplete>
      <div class="panel-search__tip">
        You can use the shortcut
        <span class="panel-search__key">{{hotkey.open}}</span>
        to wake up the search panel and
        <span class="panel-search__key">{{hotkey.close}}</span>
        to close it.
      </div>
    </div>
    <div v-if="resultsList.length > 0" class="panel-search__results-group" flex-box="1">
      <el-card shadow="never">
        <div class="panel-search__results-group-inner">
          <d2-panel-search-item
            v-for="(item, index) in resultsList"
            :key="index"
            :item="item"
            :hover-mode="true"
            @click.native="handleResultsGroupItemClick(item.path)"/>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import { mapState } from 'vuex'
import mixin from '../mixin/menu'
export default {
  mixins: [
    mixin
  ],
  components: {
    'd2-panel-search-item': () => import('./components/panel-search-item/index.vue')
  },
  data () {
    return {
      searchText: '',
      results: []
    }
  },
  computed: {
    ...mapState('d2admin/search', [
      'hotkey',
      'pool'
    ]),
    // 这份数据是展示在搜索面板下面的
    resultsList () {
      return (this.results.length === 0 && this.searchText === '') ? this.pool.map(e => ({
        value: e.fullTitle,
        ...e
      })) : this.results
    },
    // 根据 pool 更新 fuse 实例
    fuse () {
      return new Fuse(this.pool, {
        shouldSort: true,
        tokenize: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'fullTitle',
          'path'
        ]
      })
    }
  },
  methods: {
    /**
     * @description 过滤选项 这个方法在每次输入框的值发生变化时会触发
     */
    querySearch (queryString, callback) {
      const results = this.fuse.search(queryString).map(e => e.item)
      this.results = results
      callback(results)
    },
    /**
     * @description 聚焦输入框
     */
    focus () {
      this.input = ''
      setTimeout(() => {
        if (this.$refs.input) {
          this.$refs.input.focus()
        }
        // 还原
        this.searchText = ''
        this.results = []
      }, 500)
    },
    /**
     * @description 接收用户在列表中选择项目的事件
     */
    handleResultsGroupItemClick (path) {
      // 如果用户选择的就是当前页面 就直接关闭搜索面板
      if (path === this.$route.path) {
        this.handleEsc()
        return
      }
      // 用户选择的是其它页面
      this.handleMenuSelect(path)
    },
    /**
     * @description 接收用户在下拉菜单中选中事件
     */
    async handleSelect ({ path }) {
      // 如果用户选择的就是当前页面 就直接关闭搜索面板
      if (path === this.$route.path) {
        this.handleEsc()
        return
      }
      // 用户选择的是其它页面
      await this.$nextTick()
      this.handleMenuSelect(path)
    },
    /**
     * @augments 关闭输入框的下拉菜单
     */
    closeSuggestion () {
      if (this.$refs.input.activated) {
        this.$refs.input.suggestions = []
        this.$refs.input.activated = false
      }
    },
    /**
     * @augments 接收用户点击空白区域的关闭
     */
    handlePanelClick () {
      this.handleEsc()
    },
    /**
     * @augments 接收用户触发的关闭
     */
    async handleEsc () {
      this.closeSuggestion()
      await this.$nextTick()
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-search {
  margin: 20px;
  width: 100%;
  .panel-search__input-group {
    height: 240px;
    .panel-search__logo {
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
    }
    .panel-search__input {
      width: 500px;
    }
    .panel-search__tip {
      @extend %unable-select;
      margin-top: 20px;
      margin-bottom: 40px;
      font-size: 12px;
      color: $color-text-sub;
      .panel-search__key {
        padding: 1px 5px;
        margin: 0px 2px;
        border-radius: 2px;
        background-color: $color-text-normal;
        color: $color-bg;
      }
    }
  }
  .panel-search__results-group {
    overflow: auto;
    margin-bottom: -20px;
    .panel-search__results-group-inner {
      margin: -20px;
    }
  }
}
</style>
