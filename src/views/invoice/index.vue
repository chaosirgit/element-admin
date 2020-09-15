<template>
  <div class="app-container">
    <search
      :status-hidden="true"
      @search="fetchData"
    />
    <!--<el-row>-->
    <!--<el-col>-->
    <!--<el-button-->
    <!--class="filter-item"-->
    <!--style="margin-left: 10px;"-->
    <!--type="primary"-->
    <!--icon="el-icon-plus"-->
    <!--@click="handlerCreate"-->
    <!--&gt;-->
    <!--添加-->
    <!--</el-button>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="margin-top: 20px;"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="用户">
        <template slot-scope="scope">
          {{ scope.row.user.phone }}
        </template>
      </el-table-column>
      <el-table-column label="电子邮箱">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="公司名称">
        <template slot-scope="scope">
          {{ scope.row.company_name }}
        </template>
      </el-table-column>
      <el-table-column label="税号">
        <template slot-scope="scope">
          {{ scope.row.company_id }}
        </template>
      </el-table-column>
      <el-table-column label="开户行">
        <template slot-scope="scope">
          {{ scope.row.bank_name }}
        </template>
      </el-table-column>
      <el-table-column label="银行卡号">
        <template slot-scope="scope">
          {{ scope.row.bank_card }}
        </template>
      </el-table-column>
      <el-table-column label="发票金额">
        <template slot-scope="scope">
          {{ scope.row.amount }}
        </template>
      </el-table-column>
      <el-table-column label="开票状态" align="center">
        <template slot-scope="scope">
          <el-tag effect="dark" style="border: 0;" :type="scope.row.check_status === 0 ? '' : scope.row.check_status === 1 ? 'success' : 'danger'">
            {{ scope.row.status_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="关闭/开启" width="100">-->
      <!--<template slot-scope="scope">-->
      <!--<el-switch-->
      <!--v-model="scope.row.is_open"-->
      <!--v-loading="switchLoading"-->
      <!--:active-value="1"-->
      <!--:inactive-value="0"-->
      <!--@change="switchOpen(scope.row.id)"-->
      <!--/>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="success" :disabled="scope.row.status !== 0" @click="check(scope.row, scope.$index)">
              已开票
            </el-button>
            <el-button type="danger" :disabled="scope.row.status !== 0" @click="noCheck(scope.row, scope.$index)">
              拒绝开票
            </el-button>
            <!--<el-button type="primary" @click="edit(scope.row, scope.$index)">编辑</el-button>-->
            <!--<el-button type="danger" @click="del(scope.row, scope.$index)">删除</el-button>-->
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
      :title="'拒绝开票'"
      :visible.sync="dialogFormVisible"
      width="80%"
    >
      <el-form
        :model="invoice"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="拒绝理由" :label-width="formLabelWidth">
              <el-input v-model="invoice.reply" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>

        <!--<el-form-item label="商户LOGO" :label-width="formLabelWidth">-->
        <!--<el-input v-model="seller.logo" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="noCheckData()">确 定</el-button>
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
        确定已经开票吗?
      </span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHintVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="postCheck()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getList, postAdd } from '@/api/invoice'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'

export default {
  components: { Pagination, Search },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      switchLoading: true,
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
      products: [],
      dialogTableVisible: false,
      dialogRelationVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogStatus: 'create',
      invoice: {
        id: 0,
        reply: '',
        status: 0
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.data
        this.listLoading = false
        this.switchLoading = false
      })
    },
    fetchData(query) {
      this.listQuery = Object.assign(this.listQuery, query)
      console.log(this.listQuery)
      this.getList()
    },
    check(item) {
      this.dialogHintVisible = true
      this.invoice = item
      this.invoice.status = 1
    },
    postCheck() {
      postAdd(this.invoice).then(res => {
        if (res.code === 200) {
          this.dialogHintVisible = false
          this.getList()
        }
      })
    },
    noCheck(item) {
      this.dialogFormVisible = true
      this.invoice = item
      this.invoice.status = 2
    },
    noCheckData() {
      postAdd(this.invoice).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
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
</style>
