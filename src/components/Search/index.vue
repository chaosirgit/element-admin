<template>
  <el-row>
    <!--<div class="filter-container text-left">-->
    <el-row align="middle">
      <el-col :span="5">
        <el-input
          v-model="search"
          placeholder="查询关键字"
          style="width: 200px; margin-left:10px;"
          class="filter-item"
          :class="{ searchHidden: searchHidden}"
          @keyup.enter.native="handleFilter"
        />
      </el-col>
      <el-col :span="5">
        <el-select
          v-model="status"
          placeholder="选择状态"
          style="width:200px; margin-left:10px"
          class="filter-item"
          :class="{ statusHidden: statusHidden}"
        >
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <el-col :span="9">
        <div class="date-wrap filter-item" :class="{ dateHidden: dateHidden}">
          <el-col :span="11" :offset="0">
            <el-date-picker
              v-model="startTime"
              type="date"
              placeholder="起始日期"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
            />
          </el-col>
          <el-col class="line" :span="1">——</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="endTime"
              placeholder="截止日期"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
            />
          </el-col>
        </div>
      </el-col>
      <el-col :span="5">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          style="margin-left: 10px;"
          @click="handleFilter"
        >
          查询
        </el-button>
        <el-button
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          :class="{ exportHidden: exportHidden }"
          @click="handleDownload"
        >
          导出
        </el-button>
      </el-col>
    </el-row>

    <!--</div>-->
  </el-row>
</template>
<script>
export default {
  name: 'Search',
  props: {
    searchHidden: {
      type: Boolean,
      default: false
    },
    exportHidden: {
      type: Boolean,
      default: true
    },
    statusHidden: {
      type: Boolean,
      default: false
    },
    dateHidden: {
      type: Boolean,
      default: false
    },
    downloadLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusList: [
        { 'id': 1, 'name': 'success' },
        { 'id': 2, 'name': 'error' },
        { 'id': 3, 'name': 'exception' }
      ],
      search: '',
      status: null,
      startTime: '',
      endTime: ''
    }
  },
  computed: {
    // searchValue: {
    //   get() {
    //     return this.search
    //   },
    //   set(val) {
    //     this.$emit('update:search', val)
    //   }
    // },
    // statusValue: {
    //   get() {
    //     return this.status
    //   },
    //   set(val) {
    //     this.$emit('update:status', val)
    //   }
    // },
    // startTimeValue: {
    //   get() {
    //     return this.startTime
    //   },
    //   set(val) {
    //     this.$emit('update:startTime', val)
    //   }
    // },
    // endTimeValue: {
    //   get() {
    //     return this.endTime
    //   },
    //   set(val) {
    //     this.$emit('update:endTime', val)
    //   }
    // }
  },
  methods: {
    handleFilter() {
      this.$emit('search', { search: this.search, status: this.status, startTime: this.startTime, endTime: this.endTime })
    },
    handleCreate() {
      this.$emit('create')
    },
    handleDownload() {
      this.$emit('export')
    }
  }
}
</script>
<style>
    .exportHidden {
        display: none;
    }
    .searchHidden {
        display: none;
    }
    .addHidden {
        display: none;
    }
    .statusHidden {
        display: none;
    }
    .dateHidden {
        display: none;
    }
</style>
