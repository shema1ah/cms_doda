<template>
  <div class="inner">
    <span class="title">分享文案配置</span>
    <div class="app-container">
      <!-- 搜索 -->
      <el-input v-model.number="listQuery.keyword" placeholder="请输入要搜索的uid" style="width: 400px;margin-right: 20px" class="filter-item" @keyup.enter.native="handleFilter" />
      <!--搜索按钮 -->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <!-- 添加按钮 -->
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">添加文案</el-button>
      <!--表格区域-->
      <Table :thead="thead" :list="list||[]" :listLoading="listLoading" :actions="actions"></Table>
      <!--分页区域-->
      <div class="pagination-container">
        <el-pagination background layout="prev, pager, next, jumper" :total="total" :current-page="listQuery.index" :page-size="listQuery.pageSize" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
      <!--弹出层-->
      <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
        <div class="dialog" id="holylandDialog">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="90px">
            <div class="content">
              <el-form-item label="动漫名称" prop="cartoonName" class="imgName">
                <el-input v-model.trim="temp.cartoonName" placeholder="记录这一刻，输入所属动漫名" />
              </el-form-item>
              <el-form-item label=动漫区域 class="img">
                <Dropzone v-model="temp.cartoonImage" :number="0" :imgWidth="300" :imgHeight="150"></Dropzone>
              </el-form-item>
            </div>
            <div class="content">
              <el-form-item label="拍摄地点" prop="photoName" class="imgName">
                <el-input v-model.trim="temp.photoName" placeholder="记录这一刻，输入拍摄地" />
              </el-form-item>
              <el-form-item label="实景区域" class="img">
                <Dropzone v-model="temp.photoImage" :number="1" :imgWidth="300" :imgHeight="150"></Dropzone>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer clearfix">
            <el-button style="float: left" type="primary" @click="dialogFormVisible=!dialogFormVisible">取消</el-button>
            <el-button style="float: right" type="success" @click="createData()">添加</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { Loading } from 'element-ui'
import Table from "@/components/Table";
import Dropzone from "../../components/Dropzone/new";
import { getHolyList,createHoly,updateHoly,deleteHoly } from "../../api/doda/holdland.js";
export default {
  components: {
    Table,
    Dropzone
  },
  data() {
    return {
      list: [],
      listLoading: true,
      options:{
        target:'#holylandDialog', lock: true, text: '拼命加载中'
      },
      loaded:null,
      total: 0,
      thead: [], //表头信息
      roleAry: [], //当前用户拥有的角色id
      listQuery: {
        index: 1,
        pageSize: 10,
        orderType: 0,
        keyword: ""
      },
      actions: [
        { type: "danger", value: "删除", click: this.handleDelete }
      ],
      temp: {
        cartoonName: "",
        cartoonImage: "",
        photoName: "",
        photoImage: ""
      },
      dialogStatus: "",
      dialogFormVisible: false,
      rules: {
        cartoonName: [
          {
            type: "string",
            required: true,
            message: "动漫名称是必须的",
            trigger: "blur"
          }
        ],
        photoName: [
          {
            type: "string",
            required: true,
            message: "拍摄地点是必须的",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取圣地巡礼数据
    fetchData() {
      this.listLoading = true;
      getHolyList(this.listQuery).then(response => {
        console.log(response)
        let { items, totalCount } = response.data;
        const list = items;
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
            head[0] = obj;
            break;
          case "cartoonName":
            obj.label = "动漫名称";
            obj.value = key;
            head[1] = obj;
            break;
          case "cartoonImage":
            obj.label = "动漫配图";
            obj.value = key;
            obj.isImage=true;
            obj.styleObject={
              width:'70px',
              height:'70px'
            }
            head[2] = obj;
            break;
          case "photoName":
            obj.label = "拍摄地点";
            obj.value = key;
            head[3] = obj;
            break;
          case "photoImage":
            obj.label = "拍摄图片";
            obj.value = key;
            obj.isImage=true;
            obj.styleObject={
              width:'70px',
              height:'70px'
            }
            head[4] = obj;
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
      console.log("删除权限", row);
      deleteHoly({ id: row.id }).then(() => {
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
        this.total = this.total - 1;
        this.$notify({
          title: "成功",
          message: "用户删除成功",
          type: "success",
          duration: 1500
        });
      });
    },
    // 重置
    resetTemp() {
      this.temp = {
        cartoonName: "",
        cartoonImage: "",
        photoName: "",
        photoImage: ""
      };
    },
    // 图片检测
    checkout() {
      if (this.temp.cartoonImage === "" || this.temp.photoImage === "") {
        this.$message({
          message: "请上传图片",
          duration: 1500,
          type: "error"
        });
        return false;
      }
      return true;
    },
    // 新增数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid && this.checkout()) {
          this.loaded = Loading.service(this.options)
          const tempData = Object.assign({}, this.temp);
          console.log("createData", tempData);
          createHoly(tempData).then(res => {
            const item =res.data;
            this.list.unshift(item);
            if (this.list.length === 1) this.getHead(this.list);
            this.total = this.total + 1;
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "上传成功",
              type: "success",
              duration: 1000,
              onClose:()=>{
                this.loaded.close()
              }
            });
          });
        }
      });
    },
    // 编辑数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          // console.log("updateData", tempData);
          updateAccess(tempData).then(res => {
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
              duration: 1500
            });
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.app-container {
  min-width: 646px;
  .dialog {
    width: 440px;
    margin: 0px auto;
    .form-left {
      float: left;
      width: 530px;
      .wxImage,
      .commentImage {
        display: inline-block;
        width: 330px;
      }
    }
    .dialog-footer {
      display: block;
      width: 234px;
      margin: 20px auto;
      margin-top: 0px;
    }
  }
}
</style>

