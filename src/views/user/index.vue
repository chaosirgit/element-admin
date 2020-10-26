<template>
  <div class="app-container">
    <search
      :status-hidden="true"
      @search="fetchData"
    />
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
      <el-table-column label="押金">
        <template slot-scope="scope">
          {{ scope.row.deposit }}
        </template>
      </el-table-column>
      <el-table-column label="留存桶数">
        <template slot-scope="scope">
          {{ scope.row.pail_count }}
        </template>
      </el-table-column>
      <el-table-column label="积分">
        <template slot-scope="scope">
          {{ scope.row.integral }}
        </template>
      </el-table-column>
      <el-table-column label="绑定水站">
        <template slot-scope="scope">
          {{ scope.row.site_name }}
        </template>
      </el-table-column>
      <el-table-column label="新老用户">
        <template slot-scope="scope">
          {{ scope.row.is_old === 1 ? '老用户' : '新用户' }}
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">

          <div class="operation-buttons">
            <el-button type="warning" size="small" @click="userPlan(scope.row, scope.$index)">特有活动</el-button>
            <!--<el-button type="danger" size="small" @click="edit(scope.row, scope.$index)">调节水票</el-button>-->
            <el-button type="primary" size="small" @click="edit(scope.row, scope.$index)">编辑</el-button>
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
      :title="dialogStatus === 'create' ? '添加' : '编辑'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="user"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="用户手机号" :label-width="formLabelWidth">
              <el-input v-model="user.phone" autocomplete="off" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户押金" :label-width="formLabelWidth">
              <el-input-number v-model="user.deposit" :precision="2" :step="0.1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="留存桶数" :label-width="formLabelWidth">
              <el-input-number v-model="user.pail_count" :precision="0" :step="1" :min="0" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新老用户" :label-width="formLabelWidth">
              <el-radio v-model="user.is_old" :label="0">新用户</el-radio>
              <el-radio v-model="user.is_old" :label="1">老用户</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="绑定水站" :label-width="formLabelWidth">
              <el-select v-model="user.site_id" placeholder="请选择">
                <el-option
                  v-for="item in sites"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" :label-width="formLabelWidth">
              <el-input v-model="user.desc" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="特有活动"
      :visible.sync="dialogPlanVisible"
    >
      <el-button size="medium" icon="el-icon-plus" type="primary" @click="appendEle" />

      <div v-for="(item , index) in user.special_plan" :key="index">
        <el-input v-model="item.special_count" placeholder="请输入额外活动赠送数量" class="input-with-select">
          <el-select slot="prepend" v-model="item.plan_id" placeholder="请选择" style="width: 150px;">
            <el-option v-for="plan in userPlans" :key="plan.id" :label="plan.name" :value="plan.id" />
          </el-select>
          <el-button slot="append" icon="el-icon-delete" @click="deleteEle(index)" />
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSpecies">取 消</el-button>
        <el-button type="primary" @click="setSpecies">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getList, postAdd, putEdit } from '@/api/consumer'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import { getAll as planAll } from '@/api/plan'
import { getAll as siteAll } from '@/api/site'

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
      dialogPlanVisible: false,
      dialogStatus: 'update',
      plans: [],
      userPlans: [],
      user: {
        id: '',
        phone: '',
        deposit: 0,
        pail_count: 0,
        special_plan: [],
        site_id: '',
        is_old: 0,
        desc: ''
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
    this.fetchPlans()
    this.fetchSites()
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
    fetchPlans() {
      planAll().then(res => {
        if (res.code === 200) {
          this.plans = res.data
        }
      })
    },
    fetchSites() {
      siteAll().then(res => {
        if (res.code === 200) {
          this.sites = res.data
        }
      })
    },
    fetchData(query) {
      this.listQuery = Object.assign(this.listQuery, query)
      console.log(this.listQuery)
      this.getList()
    },
    handlerCreate() {
      this.user = {}
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    createData() {
      console.log(this.user)
      postAdd(this.user).then(res => {
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
      item.site_id = item.site_id === 0 ? '' : item.site_id
      this.user = item
      // this.user.is_old = this.user.is_old + ''
    },
    updateData() {
      console.log(this.user)
      putEdit(this.user).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    userPlan(item, _index) {
      this.user = item
      this.userPlans = this.plans
      this.dialogPlanVisible = true
    },
    appendEle() {
      var arr = this.user.special_plan.map(item => {
        return item.plan_id
      })
      console.log(arr)
      this.userPlans = this.plans.filter(item => {
        return !arr.includes(item.id)
      })
      if (this.userPlans.length < 1) {
        return false
      } else {
        this.user.special_plan.push({ })
      }
    },
    setSpecies() {
      console.log(this.user)
      putEdit(this.user).then(res => {
        if (res.code === 200) {
          this.dialogPlanVisible = false
          this.getList()
        }
      })
    },
    cancelSpecies() {
      this.dialogPlanVisible = false
      this.getList()
    },
    deleteEle(index) {
      this.user.special_plan = this.user.special_plan.filter((item, key) => {
        return index !== key
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
