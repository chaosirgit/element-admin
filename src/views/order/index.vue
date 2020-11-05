<template>
  <div class="app-container">
    <search
      :status-list="statusList"
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
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column type="expand" label="+">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <!--<el-form-item label="封面/组图">-->
            <!--<el-image-->
            <!--style="width: 100px; height: 100px"-->
            <!--:src="props.row.img"-->
            <!--:preview-src-list="props.row.img_arr"-->
            <!--/>-->
            <!--</el-form-item>-->
            <el-form-item label="收货人名称">
              <span>{{ props.row.user_address_name }}</span>
            </el-form-item>
            <el-form-item label="收货人地址">
              <span>{{ props.row.user_address_format }}</span>
            </el-form-item>
            <el-form-item label="收货人手机">
              <el-tag color="#000000" style="border: 0" effect="dark">{{ props.row.user_address_mobile }}</el-tag>
            </el-form-item>
            <el-form-item label="支付时间">
              <span>{{ props.row.pay_at || '未支付' }}</span>
            </el-form-item>
            <el-form-item label="派单时间">
              <span>{{ props.row.send_at || '未派单' }}</span>
            </el-form-item>
            <el-form-item label="取件时间">
              <span>{{ props.row.get_at || '未取件' }}</span>
            </el-form-item>
            <el-form-item label="完成时间">
              <span>{{ props.row.done_at || '未完成' }}</span>
            </el-form-item>
          </el-form>
          <el-divider content-position="center">商品信息</el-divider>
          <el-form v-for="item in props.row.order_items" :key="item.id" label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <el-tag color="#F56C6C" style="border: 0" effect="dark">{{ item.target_name }}</el-tag>
            </el-form-item>
            <el-form-item label="购买类型">
              <span>{{ item.type_name }}</span>
            </el-form-item>
            <el-form-item label="单价">
              <span>{{ item.price }}</span>
            </el-form-item>
            <el-form-item label="下单数量">
              <span>{{ item.origin_count }}</span>
            </el-form-item>
            <el-form-item label="获得数量">
              <span>{{ item.count }}</span>
            </el-form-item>
            <el-form-item label="桶押金单价">
              <span>{{ item.deposit }}</span>
            </el-form-item>
            <el-form-item label="桶押金总价">
              <span>{{ item.total_deposit }}</span>
            </el-form-item>
            <el-form-item label="原总价">
              <span>{{ item.origin_total_price }}</span>
            </el-form-item>
            <el-form-item label="活动价">
              <span>{{ item.total_price }}</span>
            </el-form-item>
            <el-form-item label="相关活动">
              <span>{{ item.plan_format || '无' }}</span>
            </el-form-item>
            <el-form-item label="使用水票数">
              <span>{{ item.use_ticket || '未使用' }}</span>
            </el-form-item>
            <el-form-item label="成交价">
              <span>{{ item.amount }}</span>
            </el-form-item>
            <el-divider><i class="el-icon-s-goods" /></el-divider>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="订单编号">
        <template slot-scope="scope">
          {{ scope.row.order_no }}
        </template>
      </el-table-column>
      <el-table-column label="用户手机号" align="center">
        <template slot-scope="scope">
          {{ scope.row.user_phone }}
        </template>
      </el-table-column>
      <el-table-column label="订单总额" align="center">
        <template slot-scope="scope">
          {{ scope.row.total_amount }}
        </template>
      </el-table-column>
      <el-table-column label="总数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.total_count }}
        </template>
      </el-table-column>
      <el-table-column label="分配水站" align="center">
        <template slot-scope="scope">
          {{ scope.row.site_name }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          <el-tag effect="dark" style="border: 0;" :color="scope.row.status === 0 ? '#000000' : scope.row.status === 1 ? '#909399' : scope.row.status === 2 ? '#67C23A' : scope.row.status === 3 ? '#E6A23C' : scope.row.status === 4 ? '#F56C6C' : scope.row.status === 5 ? '#409EFF' : scope.row.status === 6 ? '#d1ba74' : '#FFFFFF'">
            {{ scope.row.status_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付方式" width="95">
        <template slot-scope="scope">
          <div v-if="scope.row.pay_code === 'wechat_pay'">
            <i class="el-icon-cogeweixin" style="color: #3db22f;" />
            <span>微信支付</span>
          </div>
          <div v-else>
            <i class="el-icon-cogefenzu" style="color: #409EFF" />
            <span>水票支付</span>
          </div>
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
            <el-button v-if="scope.row.delivery_way === 2" type="primary" @click="express(scope.row, scope.$index)">发货</el-button>
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
      title="发货"
      :visible.sync="dialogExpressVisible"
    >
      <el-form
        :model="order"
      >
        <el-row style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="快递名称" :label-width="formLabelWidth">
              <el-input v-model="order.express_name" autocomplete="off" style="width: 195px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快递编号" :label-width="formLabelWidth">
              <el-input v-model="order.express_no" autocomplete="off" style="width: 195px;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogExpressVisible = false;getList()">取 消</el-button>
        <el-button type="primary" @click="postExpress()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getList, putEdit } from '@/api/order'
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
      statusList: [
        { id: null, name: '全部订单' },
        { id: 0, name: '已取消' },
        { id: 1, name: '未支付' },
        { id: 2, name: '已支付-待派单' },
        { id: 3, name: '已派单-待取货' },
        { id: 4, name: '已取货-配送中' },
        { id: 6, name: '待签收' },
        { id: 5, name: '已完成' }
      ],
      options: null,
      sellers: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogHintVisible: false,
      dialogVisible: false,
      dialogExpressVisible: false,
      dialogStatus: 'create',
      total_count: 0,
      total_amount: '0.00',
      order: {
        id: 0,
        order_no: '',
        total_count: 0,
        express_name: '',
        express_no: ''
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
        this.total_count = response.data.appends.total_count
        this.total_amount = response.data.appends.total_amount
        this.list = response.data.data.map(item => {
          item.total_count = item.order_items.map(orderItem => {
            return orderItem.count
          }).reduce((total_count, count) => {
            return total_count + count
          })
          return item
        })
        this.listLoading = false
      })
    },
    fetchData(query) {
      this.listQuery = Object.assign(this.listQuery, query)
      console.log(this.listQuery)
      this.getList()
    },
    getSummaries(param) {
      console.log(param)
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
        } else if (index === 4) {
          sums[index] = this.total_amount
        } else if (index === 5) {
          sums[index] = this.total_count
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    express(item, index) {
      this.dialogExpressVisible = true
      this.order = item
    },
    postExpress() {
      putEdit(this.order).then(res => {
        if (res.code === 200) {
          this.dialogExpressVisible = false
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
