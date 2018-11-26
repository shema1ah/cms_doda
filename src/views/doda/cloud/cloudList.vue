<template>
  <div class="inner">
    <div class="inner-top">
      <span class="title">{{title}}</span>
    </div>
    <div class="app-container">
      <!-- 搜索 -->
      <!-- <el-input v-model.number="listQuery.keyword" placeholder="请输入要搜索的内容" style="width: 400px;margin-right: 20px;margin-left: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <!--列表区域-->
      <el-row class="dataList">
        <div class="dataList-inner clearfix">
          <div class="dataItem" @click="item.fn(title,type,item.name)" v-for="item in list" :key="item.id">
            <div class="dataItem-img">
              <img :src="item.img" alt="下载图片失败" class="image">
            </div>
            <div class="dataItem-name">{{item.name}}</div>
          </div>
        </div>
      </el-row>
      <!--分页区域-->
      <!-- <div class="pagination-container">
      <el-pagination background layout="prev, pager, next, jumper" :total="total" :current-page="listQuery.index" :page-size="listQuery.pageSize" @current-change="handleCurrentChange">
      </el-pagination>
    </div> -->
      <!--弹出层-->
      <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
        <div class="dialog">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="55px" style="min-width: 450px;max-width:1000px;">
            <div class="form-left">
              <el-form-item label="标题" prop="title" class="nickname">
                <el-input v-model.trim="temp.title" />
              </el-form-item>
              <el-form-item label="内容" prop="cotent" class="cotent">
                <el-input :autosize="{ minRows: 6, maxRows: 8}" v-model.trim="temp.content" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer clearfix">
            <el-button style="float: left" type="primary" @click="dialogFormVisible=!dialogFormVisible">取消</el-button>
            <el-button style="float: right" type="success" @click="updateTip()">保存</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
// 全屏加载遮罩层
import { Loading } from 'element-ui'
import { getTip, createTip, updateTip } from "../../../api/doda/cloudConfig.js";
export default {
  data() {
    return {
      title: "",
      type: "",
      options : { fullscreen: true, lock: true, text: '拼命加载中' },
      loaded : null,
      list: [
        {
          name: "基础信息配置",
          img:
            "https://doda.oss-cn-beijing.aliyuncs.com/image/2018/10/9/d595e1539078900909.jpg",
          fn: this.cloudConfig
        },
        {
          name: "公告配置",
          img:
            "https://doda.oss-cn-beijing.aliyuncs.com/image/2018/10/9/d595e1539078900909.jpg",
          fn: this.tip
        }
      ],
      total: 0,
      dialogStatus: "",
      dialogFormVisible: false,
      rules: {
        title: [
          {
            type: "string",
            required: true,
            message: "标题是必须的",
            trigger: "blur"
          }
        ],
        content: [
          {
            type: "string",
            required: true,
            message: "描述是必须的",
            trigger: "blur"
          }
        ]
      },
      temp: {
        title: "",
        content: ""
      },
      listQuery: {
        type: 1,
        index: 1,
        pageSize: 14
      }
    };
  },
  created() {
    let { title, type } = this.$route.meta;
    this.title = title;
    this.type = parseInt(type);
    this.fetchTip();
  },
  watch: {
    $route(to, from) {
      let { title, type } = to.meta;
      this.title = title;
      this.type = parseInt(type);
    }
  },
  methods: {
    // 获取数据列表
    fetchTip() {
      getTip().then(result => {
        console.log(result.data);
        if (result.data && result.data.id) {
          let { time, ...res } = result.data;
          this.temp = res;
        }
      });
    },
    // 弹窗
    tip() {
      this.dialogStatus = this.temp.id ? "编辑" : "添加";
      this.dialogFormVisible = true;
    },
    updateTip() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loaded = Loading.service(this.options)
          const tempData = Object.assign({}, this.temp);
          console.log("createData", tempData);
          let fn = this.temp.id ? updateTip : createTip;
          fn(tempData).then(res => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "保存成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.loaded.close()
                }
              });
            })
            .catch(() => {
              this.$notify({
                title: "失败哦",
                message: "保存失败，请重试",
                type: "error",
                duration: 1000,
                onClose: () => {
                  this.loaded.close()
                }
              });
            });
        }
      });
    },
    // 去编辑文案页面
    cloudConfig(title, type, name) {
      this.$router.push({
        path: "/doda/cloudConfig/basic",
        query: { title, type, name }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.inner {
  .app-container {
    padding: 14px 21px !important;
    min-width: 554px;
    .dataList {
      &-inner {
        margin: 20px auto;
        margin-bottom: 0px;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        color: #909399;
        text-align: center;
        .dataItem {
          float: left;
          width: 150px;
          margin: 0px 10px;
          margin-bottom: 20px;
          text-align: center;
          cursor: pointer;
          transition: 0.4s;
          &:hover {
            transform: scale(1.08);
          }
          &-img {
            width: 100%;
            height: 197px;
            box-shadow: 0px 2px 12px 0 rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
          &-name {
            margin-top: 10px;
            font-size: 14px;
            line-height: 14px;
          }
        }
      }
    }
    .dialog {
      width: 440px;
      margin: 30px auto;
      &-footer {
        width: 270px;
        margin: 20px auto;
      }
    }
  }
}
</style>
