<template>
  <div class="inner">
    <span class="title">{{title}} 基础信息配置</span>
    <div class="app-container">
      <!-- 搜索 -->
      <el-input disabled v-model.number="listQuery.keyword" placeholder="请输入要搜索的内容" style="width: 400px;margin-right: 20px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button disabled class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <!--新增数据-->
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">新增数据</el-button>
      <!--表格区域-->
      <Table :thead="thead" :list="list||[]" :listLoading="listLoading" :actions="actions"></Table>
      <!--分页区域-->
      <div class="pagination-container" align="right" style="margin-top: 20px;">
        <el-pagination background layout="prev, pager, next, jumper" :total="total" :current-page="listQuery.index" :page-size="listQuery.pageSize" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
      <!--弹出层-->
      <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
        <div class="dialog" id="cloudDilog">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="min-width: 490px;">
            <el-form-item label="版本名称" prop="name">
              <el-input v-model.trim="temp.name" />
            </el-form-item>
            <el-form-item label="	版本号" prop="version">
              <el-input v-model.trim.number="temp.version"/>
            </el-form-item>
            <el-form-item label="	更新内容" prop="content">
              <el-input v-model.trim="temp.content" />
            </el-form-item>
            <el-form-item label="强制更新" prop="forceUpdate">
              <el-radio v-model="temp.forceUpdate" :label="true">是</el-radio>
              <el-radio v-model="temp.forceUpdate" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="隐藏三方登录" prop="hideOpenLogin">
              <el-radio v-model="temp.hideOpenLogin" :label="true">是</el-radio>
              <el-radio v-model="temp.hideOpenLogin" :label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="apk下载地址" prop="apkUrl">
              <el-input v-model.trim="temp.apkUrl" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer clearfix">
            <el-button style="float: left" type="primary" @click="dialogFormVisible=!dialogFormVisible">取消</el-button>
            <el-button style="float: right" type="success" @click="dialogStatus==='编辑'?updateData():createData()">{{dialogStatus=='编辑'?'保存':'添加'}}</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Table from "@/components/Table";
import {
  getCloudList,
  getCloud,
  createCloud,
  updateCloud
} from "../../../api/doda/cloudConfig.js";
import { Loading } from "element-ui";
export default {
  components: {
    Table
  },
  data() {
    return {
      title: "",
      list: [],
      listLoading: true,
      options:{
        target:'#cloudDilog', lock: true, text: '拼命加载中'
      },
      loaded:null,
      total: 0,
      thead: [], //表头信息
      listQuery: {
        index: 1,
        pageSize: 10,
        type: ""
      },
      actions: [
        { type: "primary", value: "编辑", click: this.handleUpdate }
        // { type: "danger", value: "删除", click: this.handleDelete }
      ],
      temp: {},
      dialogStatus: "",
      dialogFormVisible: false,
      rules: {
        name: [
          {
            type: "string",
            required: true,
            message: "请填写版本名称",
            trigger: "blur"
          }
        ],
        version: [
          {
            type: "number",
            required: true,
            message: "请填写版本号",
            trigger: "blur"
          }
        ],
        content: [
          {
            type: "string",
            required: true,
            message: "请填写更新内容",
            trigger: "blur"
          }
        ],
        forceUpdate: [
          {
            type: "boolean",
            required: true,
            message: "请选择是否强制更新",
            trigger: "blur"
          }
        ],
        hideOpenLogin: [
          {
            type: "boolean",
            required: true,
            message: "请选择是否隐藏三方登录",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    let { title, type, name } = this.$route.query;
    this.title = title;
    this.listQuery.type = this.temp.type = parseInt(type);
    this.fetchData();
  },
  methods: {
    // 数据处理
    dealData(data) {
      data = data || [];
      data.forEach(item => {
        item.zy_forceUpdate = item.forceUpdate ? "是" : "否";
        item.zy_hideOpenLogin = item.hideOpenLogin ? "是" : "否";
      });
      return data;
    },
    // 获取路由列表数据
    fetchData() {
      this.listLoading = true;
      getCloudList(this.listQuery).then(response => {
        console.log(response);
        let { items, totalCount } = response.data;
        const list = this.dealData(items);
        // 得出表头信息
        this.getHead(list);
        this.list = list;
        this.total = parseInt(totalCount);
        this.listLoading = false;
      });
    },
    // 根据结果计算出对应的表头
    getHead(res) {
      let head = [];
      for (let key in res[0]) {
        let obj = {};
        obj.sort = false;
        //按顺序排好
        switch (key) {
          case "id":
            obj.label = "id";
            obj.sort = true;
            obj.value = key;
            obj.width = "80";
            head[0] = obj;
            break;
          case "name":
            obj.label = "版本名称";
            obj.value = key;
            head[1] = obj;
            break;
          case "version":
            obj.label = "版本号";
            obj.value = key;
            head[2] = obj;
            break;
          case "content":
            obj.label = "更新内容";
            obj.width = "400";
            obj.value = key;
            head[3] = obj;
            break;
          case "zy_forceUpdate":
            obj.label = "强制更新";
            obj.value = key;
            head[4] = obj;
            break;
          case "zy_hideOpenLogin":
            obj.label = "隐藏三方登录";
            obj.value = key;
            head[5] = obj;
            break;
          case "apkUrl":
            obj.label = "apk下载地址";
            obj.value = key;
            head[6] = obj;
            break;
          default:
            continue;
        }
      }
      this.thead = head;
    },
    // 页码改变
    handleCurrentChange(val) {
      this.listQuery.index = val;
      this.fetchData();
    },
    // 搜索
    handleFilter() {
      this.listQuery.index = 1;
      this.fetchData();
    },
    // 新增按钮
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "添加";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 编辑
    handleUpdate(row) {
      console.log(row);
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "编辑";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 删除数据
    handleDelete(row) {
      console.log("删除路由", row);
      deleteRoute({ id: row.id }).then(() => {
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
        this.total = this.total - 1;
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 1500
        });
      });
    },
    // 重置
    resetTemp() {
      this.temp = {
        name: "",
        version: "",
        content: "",
        forceUpdate: "",
        hideOpenLogin: "",
        apkUrl: "",
        version: "",
        type:this.listQuery.type
      };
    },
    // 新增数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loaded = Loading.service(this.options)
          const tempData = Object.assign({}, this.temp);
          console.log("createData", tempData);
          createCloud(tempData).then(res => {
            const item = this.dealData([res.data])[0];
            console.log(item)
            this.list.unshift(item);
            if (this.list.length === 1) this.getHead(this.list);
            this.total = this.total + 1;
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 1000,
              onClose:()=>{
                this.loaded.close()
              }
            });
          }).catch(()=>{
            this.$notify({
              title: "失败",
              message: "创建失败,请重试",
              type: "error",
              duration: 1000,
              onClose:()=>{
                this.loaded.close()
              }
            });
          })
        }
      });
    },
    // 编辑数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loaded = Loading.service(this.options)
          const tempData = Object.assign({}, this.temp);
          console.log("updateData", tempData);
          updateCloud(tempData).then(res => {
            const item = this.dealData([res.data])[0];
            for (const v of this.list) {
              if (v.id === item.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, item);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 1000,
              onClose:()=>{
                this.loaded.close()
              }
            });
          }).catch(()=>{
            this.$notify({
              title: "失败",
              message: "更新失败,请重试",
              type: "error",
              duration: 1000,
              onClose:()=>{
                this.loaded.close()
              }
            });
          })
        }
      });
    }
  }
};
</script>
<style lang="scss">
.app-container {
  .dialog {
    width: 500px;
    margin: 0 auto;
    .dialog-footer {
      display: block;
      width: 234px;
      margin: 30px auto;
      margin-top: 20px;
    }
  }
}
</style>
