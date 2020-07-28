<template>
  <div class="app-container">
    <el-tree
      ref="tree"
      v-loading="loading"
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps"
      @node-contextmenu="showOperation"
      @check="needParentGet"
    />

    <div class="buttons">
      <el-button type="primary" @click="addCategory">添加分类</el-button>
      <el-button :disabled="editDisable" @click="editCategory">编辑分类</el-button>
      <el-button type="danger" @click="deleteCategory">删除分类</el-button>
    </div>

    <el-dialog
      :title="dialogStatus === 'create' ? '添加分类' : '编辑分类'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="category"
      >
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="category.name" autocomplete="off" />
        </el-form-item>
        <!--<el-form-item label="商户LOGO" :label-width="formLabelWidth">-->
        <!--<el-input v-model="seller.logo" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { getList } from '@/api/category'

export default {

  data() {
    return {
      data: [],
      loading: false,
      dialogStatus: 'create',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      editDisable: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      category: {
        id: '',
        name: '',
        parent_id: 0
      },
      needParentId: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    addCategory() {
      this.category = {}
      this.dialogFormVisible = true
    },
    editCategory() {
      console.log(this.needParentId)
      this.category = this.$refs.tree.getCheckedNodes()[0]
      this.dialogFormVisible = true
    },
    deleteCategory() {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    getList() {
      this.loading = true
      getList().then(res => {
        console.log(res)
        this.data = res.data
        this.loading = false
      })
    },
    showOperation(evn, row, node, comp) {
      console.log(row, node, comp)
    },
    needParentGet() {
      console.log(this.$refs.tree.getCheckedNodes())
      if (this.$refs.tree.getCheckedNodes().length > 0) {
        this.needParentId = this.$refs.tree.getCheckedNodes()[0].id
        this.category = this.$refs.tree.getCheckedNodes()[0]
        this.editDisable = false
      } else {
        this.needParentId = 0
        this.editDisable = true
      }
    }
  }
}
</script>
