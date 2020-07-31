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
      <el-table-column label="水站名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="水站地址">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="所属商户">
        <template slot-scope="scope">
          {{ scope.row.seller_name }}
        </template>
      </el-table-column>
      <el-table-column label="站长昵称">
        <template slot-scope="scope">
          {{ scope.row.op_name }}
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
      :title="dialogStatus === 'create' ? '添加水站' : '编辑水站'"
      :visible.sync="dialogFormVisible"
      width="80%"
      @close="cancel"
    >
      <el-form
        :model="site"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="水站名称" :label-width="formLabelWidth">
              <el-input v-model="site.name" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水站地址" :label-width="formLabelWidth">
              <el-input v-model="site.address" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="指定商户" :label-width="formLabelWidth">
              <el-select
                v-model="site.seller_id"
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
            <el-form-item label="指定站长" :label-width="formLabelWidth">
              <el-select
                v-model="site.op_id"
                filterable
                placeholder="请选择"
                @change="selectOp"
              >
                <el-option
                  v-for="item in deliverers"
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 20px">
          <el-col :span="24">
            <el-form-item label="选择地点" :label-width="formLabelWidth">
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                type="primary"
                icon="el-icon-location"
                @click="handlerSelectLocation"
              >
                点击选择
              </el-button>
              <div v-if="site.longitude && site.latitude" class="text-center" style="margin-top:10px">
                经度： {{ site.longitude }} 纬度： {{ site.latitude }}
              </div>
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
        此操作会直接删除水站，可能会产生数据关联错误，确定删除吗？
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
      title="选择位置 "
      :visible.sync="dialogAMapVisible"
      class="text-center"
      center
      width="70%"
    >
      <template>
        <div class="amap-page-container">
          <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult" />
          <el-amap vid="amapDemo" :center="mapCenter" :zoom="12" :events="events" class="amap-demo" style="height: 700px;">
            <el-amap-marker v-for="marker in markers" :position="marker" />
          </el-amap>
        </div>
      </template>

    </el-dialog>
  </div>

</template>

<script>
import { getList, postAdd, putEdit, delItem } from '@/api/site'
import { getAll as delivererAllList } from '@/api/deliverer'
import { getAll as sellerAllList } from '@/api/seller'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Search from '@/components/Search'
import { AMapManager } from 'vue-amap'
const amapManager = new AMapManager()

export default {
  components: { Pagination, Search },
  data() {
    return {
      searchOption: {
        city: '郑州',
        citylimit: false
      },
      amapManager,
      zoom: 12,
      events: {
        'click': (e) => {
          console.log(e)
          this.site.longitude = e.lnglat.lng
          this.site.latitude = e.lnglat.lat
          this.markers = [[this.site.longitude, this.site.latitude]]
        }
      },
      mapCenter: [113.601979, 34.794764],
      markers: [],
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
      deliverers: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogAMapVisible: false,
      dialogStatus: 'create',
      site: {
        id: 0,
        name: '',
        address: 0,
        seller_id: 0,
        seller_name: '',
        longitude: '',
        latitude: '',
        op_name: '',
        op_id: 0
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
    fetchSellers() {
      sellerAllList().then(res => {
        this.sellers = res.data
      })
    },
    fetchDeliverer() {
      delivererAllList().then(res => {
        this.deliverers = res.data
      })
    },
    handlerCreate() {
      this.fetchSellers()
      this.fetchDeliverer()
      this.site = { }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.mapCenter = [113.601979, 34.794764]
      this.markers = []
    },
    createData() {
      console.log(this.site)
      this.site.deliverer_id = this.site.op_id
      postAdd(this.site).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    edit(item, _index) {
      console.log(item, _index)
      this.fetchSellers()
      this.fetchDeliverer()
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.site = item
      this.mapCenter = [this.site.longitude, this.site.latitude]
      this.markers = [[this.site.longitude, this.site.latitude]]
    },
    del(item, _index) {
      this.dialogHintVisible = true
      this.site = item
    },
    updateData() {
      this.site.deliverer_id = this.site.op_id
      putEdit(this.site).then(res => {
        if (res.code === 200) {
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    delData() {
      delItem(this.site).then(res => {
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
      this.site.seller_id = id
    },
    selectOp(id) {
      this.site.op_id = id
    },
    handlerSelectLocation() {
      this.dialogAMapVisible = true
    },
    onSearchResult(pois) {
      console.log(pois)
      if (pois.length > 0) {
        this.mapCenter = [pois[0].lng, pois[0].lat]
      }
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
