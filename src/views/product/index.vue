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
      <el-table-column label="商户名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序权重" width="95">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <!--<el-table-column class-name="status-col" label="状态" width="110" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <div class="operation-buttons">
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
      :title="dialogStatus === 'create' ? '添加商品' : '编辑商品'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="product"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <div class="box-center">
              <el-upload
                ref="upload"
                action="http://waterhero.test/admin/v1/upload"
                class="avatar-uploader tex-center"
                name="file"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :headers="headers"
              >
                <img v-if="product.img" :src="product.img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div class="text-center" style="margin-top:10px">
                上传商品封面图(像素:651 x 651)
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <div class="box-center">
              <el-upload
                action="http://waterhero.test/admin/v1/upload"
                list-type="picture-card"
                :on-success="imgArrAdd"
                :on-remove="imgArrRemove"
                :file-list="product.img_arr"
                :headers="headers"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <div class="text-center" style="margin-top:10px">
                上传商品图组(像素:651 x 651)<br>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="商品名称" :label-width="formLabelWidth">
              <el-input v-model="product.name" autocomplete="off" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择商品分类" :label-width="formLabelWidth">
              <el-cascader
                v-model="product.category_id"
                :options="options"
                :props="{ expandTrigger: 'hover',value: 'id', label: 'name', checkStrictly: true,emitPath: false }"
                size="medium"
                @change="handleChange"
              />
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
        此操作会删除商户，确定删除吗？
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
import { getList, postAdd, putEdit, delItem } from '@/api/product'
import { getList as categoryGetList } from '@/api/category'
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
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogStatus: 'create',
      product: {
        id: 0,
        name: '',
        category_id: 0,
        seller_id: 0,
        img: '',
        img_arr: null,
        price: '',
        content: ''
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
    this.fetchCategories()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.data.map(item => {
          item.img_arr = item.img_arr.map(url => {
            return { url: url }
          })
          return item
        })
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
    fetchCategories() {
      categoryGetList().then(res => {
        this.options = res.data
      })
    },
    handlerCreate() {
      this.product = {}
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    createData() {
      console.log(this.product)
      postAdd(this.product).then(res => {
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
      this.product = item
    },
    del(item, _index) {
      this.dialogHintVisible = true
      this.product = item
    },
    updateData() {
      putEdit(this.product).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    delData() {
      delItem(this.product).then(res => {
        if (res.code === 200) {
          this.dialogHintVisible = false
          this.getList()
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.$loading().close()
      console.log(res)
      this.product.img = res.data
    },
    handleChange(val) {
      this.product.category_id = val
    },
    imgArrAdd(res) {
      if (res.code === 200) {
        this.product.img_arr = { url: res.data }
      }
      console.log(this.product.img_arr)
    },
    imgArrRemove(file, fileList) {
      console.log(fileList)
      this.product.img_arr = fileList.map(item => {
        return { url: item.url }
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
