<template>
  <div class="app-container">
    <search
      :status-hidden="true"
      @search="fetchData"
    />
    <el-row />
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
      <el-table-column align="center" label="头像" width="95">
        <template slot-scope="scope">
          <el-avatar :size="50" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="所属水站">
        <template slot-scope="scope">
          {{ scope.row.site_name }}
        </template>
      </el-table-column>
      <el-table-column label="身份">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_op" type="danger">站长</el-tag>
          <el-tag v-else type="success">配送员</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="primary" @click="edit(scope.row, scope.$index)">调度水站</el-button>
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
      :title="dialogStatus === 'create' ? '添加' : '调度配送员'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="deliverer"
      >
        <el-form-item label="选择水站" :label-width="formLabelWidth">
          <el-select
            v-model="deliverer.site_id"
            filterable
            placeholder="请选择"
            @change="selectSite"
          >
            <el-option value="0" label="未绑定" />
            <el-option
              v-for="item in sites"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getList, putMove } from '@/api/deliverer'
import { getAll as getSiteAllList } from '@/api/site'
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
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogStatus: 'update',
      deliverer: {
        id: '',
        site_id: 0
      },
      sites: [],
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
    fetchSites() {
      getSiteAllList().then(res => {
        this.sites = res.data
      })
    },
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
    handlerCreate() {
      this.seller = {}
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    edit(item, _index) {
      console.log(item, _index)
      this.fetchSites()
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.deliverer = item
    },
    updateData() {
      putMove(this.deliverer).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.$loading().close()
      console.log(res)
      this.seller.logo = res.data
    },
    selectSite(id) {
      this.deliverer.site_id = id
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
