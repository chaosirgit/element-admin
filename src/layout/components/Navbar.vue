<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!--<router-link to="/">-->
          <!--<el-dropdown-item>-->
          <!--Home-->
          <!--</el-dropdown-item>-->
          <!--</router-link>-->
          <!--<a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">-->
          <!--<el-dropdown-item>Github</el-dropdown-item>-->
          <!--</a>-->
          <!--<a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">-->
          <!--<el-dropdown-item>Docs</el-dropdown-item>-->
          <!--</a>-->
          <el-dropdown-item divided @click.native="setting">
            <span style="display:block;">设 置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登 出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="设置"
      :visible.sync="dialogSettingVisible"
      width="80%"
    >

      <div class="box-center">
        <el-upload
          :action="uploadApi"
          list-type="picture-card"
          :on-success="imgArrAdd"
          :on-remove="imgArrRemove"
          :file-list="banner"
          :headers="headers"
          :multiple="true"
        >
          <i class="el-icon-plus" />
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            >
            <span class="el-upload-list__item-actions">
              <el-tooltip class="item" effect="dark" :content="file.redirect || '暂无跳转链接'" placement="top">
                <span
                  v-if="true"
                  class="el-upload-list__item-delete"
                  @click="addRedirect(file)"
                >
                  <i class="el-icon-link" />
                </span>
              </el-tooltip>
              <span
                v-if="true"
                class="el-upload-list__item-delete"
                @click="imgArrRemove(file)"
              >
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
        </el-upload>
        <div class="text-center" style="margin-top:10px">
          上传 Banner 图组<br>
        </div>
        <div class="text-center" style="margin-top:20px;">
          分享分佣比例:
          <el-input v-model="ratio" :min="1" :max="100" type="number">
            <template slot="append">%</template>
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSettingVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData()">确 定</el-button>
      </div>

    </el-dialog>

    <el-dialog
      title="关联跳转"
      :visible.sync="dialogAddRedirectVisible"
      width="50%"
    >

      <div class="box-center">
        <el-input v-model="redirect" placeholder="请输入跳转链接" />
        <el-radio v-model="urlType" label="url">链接</el-radio>
        <el-radio v-model="urlType" label="miniProgram">小程序</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddRedirectVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRedirect()">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { postAdd, getSetting } from '@/api/setting'
import { Message } from 'element-ui'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    headers() {
      return {
        Authorization: this.$store.getters.token
      }
    }
  },
  data() {
    return {
      dialogSettingVisible: false,
      uploadApi: process.env.VUE_APP_UPLOAD_API,
      banner: [],
      dialogAddRedirectVisible: false,
      current: {},
      redirect: '',
      ratio: 0,
      urlType: 'url'
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('admin/logout')
      this.$router.push(`/login`)
    },
    setting() {
      this.dialogSettingVisible = true
      getSetting().then(res => {
        if (res.code === 200 && res.data.banner !== undefined) {
          this.banner = JSON.parse(res.data.banner)
          this.ratio = res.data.income_ratio
        }
      })
    },
    imgArrAdd(res, file, fileList) {
      if (res.code === 200) {
        this.banner.push({ url: res.data })
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    imgArrRemove(file, fileList) {
      this.banner = this.banner.filter(ele => {
        return file.url !== ele.url
      })
    },
    updateData() {
      this.$loading()
      postAdd({ banner: JSON.stringify(this.banner), income_ratio: this.ratio }).then(res => {
        this.$loading().close()
        if (res.code === 200) {
          this.dialogSettingVisible = false
        }
      })
    },
    addRedirect(file) {
      this.redirect = file.redirect || ''
      this.urlType = file.urlType || 'url'
      this.dialogAddRedirectVisible = true
      this.current = file
    },
    confirmRedirect() {
      console.log(this.redirect)
      this.current.redirect = this.redirect
      this.current.urlType = this.urlType
      this.banner.map(ele => {
        if (ele.url === this.current.url) {
          ele.redirect = this.current.redirect
          ele.urlType = this.current.urlType
          return ele
        }
      })
      console.log(this.banner)
      this.dialogAddRedirectVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
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
