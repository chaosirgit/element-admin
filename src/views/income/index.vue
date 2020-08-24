<template>
  <div class="app-container">
    <!--<search-->
    <!--:status-hidden="true"-->
    <!--@search="fetchData"-->
    <!--/>-->
    <el-row>
      <el-col>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-plus"
          @click="handlerCreate"
        >
          添加
        </el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="帐号名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="联系手机" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="单位收益" align="center">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="余额" align="center">
        <template slot-scope="scope">
          {{ scope.row.balance }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="warning" @click="settle(scope.row, scope.$index)">结算</el-button>
            <el-button type="primary" @click="edit(scope.row, scope.$index)">编辑</el-button>
            <el-button type="danger" @click="del(scope.row, scope.$index)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      class="text-left"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />

    <el-dialog
      :title="dialogStatus === 'create' ? '添加收益帐号' : '编辑收益帐号'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="income"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="8">
            <el-form-item label="帐号名称" :label-width="formLabelWidth">
              <el-input v-model="income.name" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" :label-width="formLabelWidth">
              <el-input v-model="income.phone" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位收益" :label-width="formLabelWidth">
              <el-input-number v-model="income.price" autocomplete="off" :step="0.5" :min="0.00" :precision="2" />
            </el-form-item>
          </el-col>
        </el-row>

        <!--<el-form-item label="商户LOGO" :label-width="formLabelWidth">-->
        <!--<el-input v-model="seller.logo" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提醒 "
      :visible.sync="dialogHintVisible"
      class="text-center"
      center
      width="30%"
    >
      <span class="text-center">
        此操作会直接删除收益帐号，可能会产生数据关联错误，确定删除吗？
      </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="delData()">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { getList, postAdd, putEdit, delItem, postSettle } from '@/api/income'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        search: '',
        status: null,
        startTime: '',
        endTime: ''
      },
      options: null,
      dialogTableVisible: false,
      dialogGrantVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogAMapVisible: false,
      dialogStatus: 'create',
      routesData: [],
      scopes: [],
      income: {
        id: 0,
        name: '',
        phone: '',
        balance: '0.00',
        price: '0,00'
      },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    headers() {
      return {
        Authorization: this.$store.getters.token
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.data
        this.listLoading = false
      })
    },
    cancel() {
      this.dialogFormVisible = false
      this.getList()
    },
    fetchData(query) {
      this.listQuery = Object.assign(this.listQuery, query)
      console.log(this.listQuery)
      this.getList()
    },

    handlerCreate() {
      this.income = { }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    createData() {
      postAdd(this.income).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    edit(item, _index) {
      console.log(item, _index)
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.income = item
    },
    updateData() {
      putEdit(this.income).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    handleAvatarSuccess(res) {
      this.$loading().close()
      console.log(res)
      this.product.img = res.data
    },
    handleChange(val) {
      this.product.category_id = val
    },
    selectSeller(id) {
      this.admin.role_id = id
    },
    handlerSelectLocation() {
      this.dialogAMapVisible = true
    },
    del(item) {
      this.dialogHintVisible = true
      this.income = item
    },
    delData() {
      delItem(this.income).then(res => {
        if (res.code === 200) {
          this.dialogHintVisible = false
          this.getList()
        }
      })
    },
    settle(item) {
      this.$prompt('请输入结算金额', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        postSettle({ id: item.id, value: value }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: item.name + ' 结算成功'
            })
            this.getList()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
    .box-center {
        margin: 0 auto;
        display: table;
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409eff;
        }
        .avatar-uploader .el-upload .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            // width: 178px;
            height: 178px;
            display: block;
            object-fit: cover;
        }
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .amap-demo {
        height: 700px;
    }

    .search-box {
        position: absolute;
        top: 25px;
        left: 20px;
    }

    .amap-page-container {
        position: relative;
    }
</style>
