<template>
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="pageSizes"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
</template>
<script>
  export default {
    name: 'Pagination',
    data() {
      return {
        total: 0,
        limit: 10,
        page: 1,
        pageSizes: [10, 20, 30, 50, 100]
      }
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    }
  }
</script>

<style scoped>
    .pagination-container {
        background: #fff;
        padding: 32px 16px;
    }
    .pagination-container.hidden {
        display: none;
    }
</style>
