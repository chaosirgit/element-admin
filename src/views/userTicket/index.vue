<template>
  <div class="app-container">
    <search
      :status-hidden="true"
      @search="fetchData"
    />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="margin-top: 10px;"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像" width="95">
        <template slot-scope="scope">
          <el-avatar :size="50" :src="scope.row.user.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="scope">
          {{ scope.row.user.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="用户手机" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="水票名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.ticket_name }}
        </template>
      </el-table-column>
      <el-table-column label="关联商品" align="center">
        <template slot-scope="scope">
          {{ scope.row.product_name }}
        </template>
      </el-table-column>
      <el-table-column label="水票数量" align="center">
        <template slot-scope="scope">
          <el-tag effect="dark" style="border: 0;" color="#000000">{{ scope.row.count }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户地址" align="center">
        <template slot-scope="scope">
          <el-tag effect="dark" style="border: 0;" color="#000000">{{ scope.row.user_address_default.format_address }}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column class-name="status-col" label="状态" width="110" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="创建时间" width="200">-->
      <!--<template slot-scope="scope">-->
      <!--<i class="el-icon-time" />-->
      <!--<span>{{ scope.row.created_at }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="primary" @click="edit(scope.row, scope.$index)">调节水票</el-button>
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
      title="提醒 "
      :visible.sync="dialogHintVisible"
      class="text-center"
      center
      width="30%"
    >
      <span class="text-center">
        此操作会直接删除商品，可能会产生数据关联错误，确定删除吗？
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

    <el-dialog
      title="调节水票"
      :visible.sync="dialogEditVisible"
      class="text-center"
      center
      width="30%"
    >
      <el-input-number v-model="userTicket.count" :min="0" :step="1" label="水票数量" />
      <el-input v-model="desc" placeholder="请输入备注" label="调节备注" style="margin-top: 10px" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate()">
          取消
        </el-button>
        <el-button type="primary" @click="updateTicket()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getList, putEdit } from '@/api/userTicket'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'

export default {
  components: { Pagination, Search },
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
      sellers: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogEditVisible: false,
      dialogVisible: false,
      dialogStatus: 'create',
      desc: '',
      userTicket: {
        id: 0,
        count: 0
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
    fetchData(query) {
      this.listQuery = Object.assign(this.listQuery, query)
      console.log(this.listQuery)
      this.getList()
    },
    edit(item, index) {
      this.dialogEditVisible = true
      this.desc = ''
      this.userTicket = item
    },
    cancelUpdate() {
      this.userTicket = {}
      this.dialogEditVisible = false
      this.getList()
    },
    updateTicket() {
      putEdit(Object.assign(this.userTicket, { desc: this.desc })).then(res => {
        if (res.code === 200) {
          this.dialogEditVisible = false
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
</style>
