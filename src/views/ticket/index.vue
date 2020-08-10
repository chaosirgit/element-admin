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
      <el-table-column label="水票名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="水票价格">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="关闭/开启" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_open"
            v-loading="switchLoading"
            :active-value="1"
            :inactive-value="0"
            @change="switchOpen(scope.row.id)"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <div class="operation-buttons">
            <el-button type="success" @click="relation(scope.row, scope.$index)">
              关联商品
            </el-button>
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
      :title="dialogStatus === 'create' ? '添加水票' : '编辑水票'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="ticket"
      >

        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="水票名称" :label-width="formLabelWidth">
              <el-input v-model="ticket.name" autocomplete="off" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水票价格" :label-width="formLabelWidth">
              <el-input-number v-model="ticket.price" :precision="2" :step="0.1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>

        <!--<el-form-item label="商户LOGO" :label-width="formLabelWidth">-->
        <!--<el-input v-model="seller.logo" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
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
        此操作会删除水票，可能会造成数据关联错误，确定删除吗？
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
      title="关联选择"
      :visible.sync="dialogRelationVisible"
      class="text-center"
      center
      width="80%"
    >
      <template>
        <div class="box-center">
          <!--model 选择值数组 data 备用值数组-->
          <el-transfer
            v-model="ticket.product_arr"
            filterable
            filter-placeholder="请输入商品名称搜索"
            :data="products"
            :titles="['待选列表','已选择列表']"
            :props="{ key: 'id', label: 'name' }"
            @change="selectRelation"
          />
        </div>
      </template>
      <!--商品视图-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRelationVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="postRelationData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getList, postAdd, putEdit, delItem, openCheck, ticketRelation } from '@/api/ticket'
import { getAll as getAllProducts } from '@/api/product'
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
      ticket: {
        id: '',
        name: '',
        price: '0.00',
        product_arr: []
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
    this.getProducts()
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
    handlerCreate() {
      this.ticket = {}
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    createData() {
      console.log(this.ticket)
      postAdd(this.ticket).then(res => {
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
      this.ticket = item
    },
    del(item, _index) {
      this.dialogHintVisible = true
      this.ticket = item
    },
    updateData() {
      putEdit(this.ticket).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    delData() {
      delItem(this.ticket).then(res => {
        if (res.code === 200) {
          this.dialogHintVisible = false
          this.getList()
        }
      })
    },
    selectModel(model) {
      console.log(model)
      this.ticket.model = model
    },
    selectMeans(means) {
      this.ticket.means = means
    },
    switchOpen(id) {
      this.switchLoading = true
      openCheck({ id: id }).then(res => {
        this.switchLoading = false
        this.getList()
      })
    },
    getProducts() {
      getAllProducts().then(res => {
        if (res.code === 200) {
          this.products = res.data
        }
      })
    },
    selectRelation(item) {
      console.log(item)
      this.ticket.product_arr = item
    },
    postRelationData() {
      ticketRelation(this.ticket).then(res => {
        if (res.code === 200) {
          this.dialogRelationVisible = false
          this.getList()
        }
      })
    },
    relation(row) {
      console.log(row)
      this.ticket = row
      this.dialogRelationVisible = true
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
