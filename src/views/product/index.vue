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
      <el-table-column type="expand" label="+">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="封面/组图">
              <el-image
                style="width: 100px; height: 100px"
                :src="props.row.img"
                :preview-src-list="props.row.img_arr"
              />
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属商户">
              <span>{{ props.row.seller_name }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="商户 ID">
              <span>{{ props.row.seller_id }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category_name }}</span>
            </el-form-item>
            <el-form-item label="商品标签">
              <el-tag
                v-for="(item,index) in props.row.tags"
                :key="index"
              >
                {{ item }}
              </el-tag>
            </el-form-item>
            <el-form-item label="关联水票">
              <span>{{ props.row.ticket !== null ? props.row.ticket.name : '暂未关联' }}</span>
            </el-form-item>
            <el-form-item label="水票活动">
              <span>{{ props.row.ticket !== null ? props.row.ticket.plan_format : '暂无活动' }}</span>
            </el-form-item>
            <el-form-item label="活动ID">
              <span>{{ props.row.ticket !== null ? props.row.ticket.plan_id : '暂无活动' }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <!--<span>{{ props.row.content }}</span>-->
              <span v-html="props.row.content" />
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="商品分类">
        <template slot-scope="scope">
          {{ scope.row.category_name }}
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column label="押金">
        <template slot-scope="scope">
          {{ scope.row.deposit }}
        </template>
      </el-table-column>
      <el-table-column label="关联水票">
        <template slot-scope="scope">
          {{ scope.row.ticket !== null ? scope.row.ticket.name : '暂未关联' }}
        </template>
      </el-table-column>
      <el-table-column label="水票活动">
        <template slot-scope="scope">
          {{ scope.row.ticket !== null ? scope.row.ticket.plan_format : '暂无活动' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序权重" width="95">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="下架/上架" width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_up"
            v-loading="switchLoading"
            :active-value="1"
            :inactive-value="0"
            @change="switchUp(scope.row.id)"
          />
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
                :action="uploadApi"
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
                :action="uploadApi"
                list-type="picture-card"
                :on-success="imgArrAdd"
                :on-remove="imgArrRemove"
                :file-list="product.img_list"
                :headers="headers"
                :multiple="true"
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
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="指定商户" :label-width="formLabelWidth">
              <el-select
                v-model="product.seller_id"
                filterable
                placeholder="请选择"
                @change="selectSeller"
              >
                <el-option
                  v-for="item in sellers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品价格" :label-width="formLabelWidth">
              <el-input-number v-model="product.price" :precision="2" :step="0.1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="桶押金" :label-width="formLabelWidth">
              <el-input-number v-model="product.deposit" :precision="2" :step="0.1" :min="0.00" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品标签" :label-width="formLabelWidth">
              <el-input v-model="tag" placeholder="请输入内容" style="width: 195px;">
                <el-button slot="append" icon="el-icon-circle-plus" @click="appendTag" />
              </el-input>
              <el-row>
                <el-tag
                  v-for="(item,index) in product.tags"
                  :key="index"
                  closable
                  @close="removeTag(index)"
                >
                  {{ item }}
                </el-tag>
              </el-row>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="排序权重" :label-width="formLabelWidth">
              <el-tooltip class="item" effect="dark" content="数字越大排序越前" placement="right-start">
                <el-input-number v-model="product.sort" autocomplete="off" />
              </el-tooltip>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配送费" :label-width="formLabelWidth">
              <el-input-number v-model="product.delivery_price" autocomplete="off" :precision="2" :step="0.1" :min="0.00" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="产品单位" :label-width="formLabelWidth">
              <el-input v-model="product.quantifier" autocomplete="off" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="商品内容" :label-width="formLabelWidth">
              <tinymce v-model="product.content" />
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
  </div>

</template>

<script>
import { getList, postAdd, putEdit, delItem, upCheck } from '@/api/product'
import { getList as categoryGetList } from '@/api/category'
import { getAll as sellerAllList } from '@/api/seller'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce, Pagination, Search },
  data() {
    return {
      uploadApi: process.env.VUE_APP_UPLOAD_API,
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
      options: null,
      sellers: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogStatus: 'create',
      product: {
        id: 0,
        name: '',
        category_id: 0,
        seller_id: null,
        img: '',
        img_arr: [],
        img_list: [],
        price: '0.00',
        content: '',
        category_name: '',
        seller_name: '',
        is_up: 0,
        tags: [],
        delivery_price: 0,
        quantifier: ''
      },
      tag: '',
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
        this.list = response.data.data.map(item => {
          // 图片列表
          item.img_list = item.img_arr.map(url => {
            return { url }
          })
          return item
        })
        this.listLoading = false
        this.switchLoading = false
      })
    },
    switchUp(id) {
      this.switchLoading = true
      upCheck({ id: id }).then(res => {
        this.switchLoading = false
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
      categoryGetList({ seller_id: this.product.seller_id }).then(res => {
        this.options = res.data
      })
    },
    fetchSellers() {
      sellerAllList().then(res => {
        this.sellers = res.data
      })
    },
    handlerCreate() {
      this.fetchSellers()
      this.product = { img: '' }
      this.product.img_list = []
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.tag = ''
      this.product.tags = []
      this.fetchCategories()
    },
    createData() {
      this.product.img_arr = this.product.img_list.map(img => {
        return img.url
      })
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
      this.fetchSellers()
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.product = item
      this.tag = ''
      this.fetchCategories()
    },
    del(item, _index) {
      this.dialogHintVisible = true
      this.product = item
    },
    updateData() {
      this.product.img_arr = this.product.img_list.map(img => {
        return img.url
      })
      console.log(this.product)
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
    handleAvatarSuccess(res) {
      this.$loading().close()
      console.log(res)
      this.product.img = res.data
    },
    handleChange(val) {
      this.product.category_id = val
    },
    imgArrAdd(res, file, fileList) {
      if (res.code === 200) {
        this.product.img_list.push({ url: res.data })
      }
      console.log(file)
      console.log(this.product.img_list)
    },
    imgArrRemove(file, fileList) {
      console.log(file)
      this.product.img_list = this.product.img_list.filter(ele => {
        return file.url !== ele.url
      })
      console.log(this.product.img_list)
    },
    selectSeller(id) {
      this.product.seller_id = id
      this.fetchCategories()
    },
    appendTag() {
      this.product.tags.push(this.tag)
      this.tag = ''
    },
    removeTag(index) {
      this.product.tags.splice(index, 1)
      console.log(this.product.tags)
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
