<template>
  <div class="inner">
    <span class="title">{{name}}文案配置</span>
    <el-button type="primary" size="mini" @click="goBack" style="float:right;">返回</el-button>
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
        <div class="dialog">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="min-width: 450px;max-width:1000px;">
            <div class="form-left">
              <el-form-item label="标题" prop="title" class="nickname">
                <el-input v-model.trim="temp.title" />
              </el-form-item>
              <el-form-item label="描述" prop="des" class="des">
                <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="temp.des" type="textarea" placeholder="请输入详情" />
              </el-form-item>
              <el-form-item label="微信分享图(300*300px)" class="wxImage">
                <Dropzone v-model="temp.wxImage" :number="0" :imgWidth="150" :imgHeight="150" :imgSize="'300*300'"></Dropzone>
              </el-form-item>
              <el-form-item label="朋友圈分享图(尺寸不限)" class="commentImage">
                <Dropzone v-model="temp.commentImage" :number="1" :imgWidth="150" :imgHeight="150"></Dropzone>
              </el-form-item>
              <el-form-item label="小程序分享图(400*320px)" class="miniImage">
                <Dropzone v-model="temp.miniImage" :number="2" :imgWidth="200" :imgHeight="160" :imgSize="'400*320'"></Dropzone>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer clearfix">
            <el-button style="float: left" type="primary" @click="dialogFormVisible=!dialogFormVisible">取消</el-button>
            <el-button style="float: right" type="success" @click="dialogStatus==='添加'?createData():updateData()">保存</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Table from "@/components/Table";
import Dropzone from "../../../components/Dropzone/new";
import { getPfList,createPf,updatePf,deletePf} from "../../../api/doda/share/platform.js";
import { getGameList,createGame,updateGame,deleteGame} from "../../../api/doda/share/game.js";
export default {
  components: {
    Table,
    Dropzone
  },
  data() {
    return {
      name:'',
      list: [],
      listLoading: false,
      saveLoading:false,
      total: 0,
      thead: [], //表头信息
      listQuery: {
        gameId: "",
        index: 1,
        pageSize: 10,
        orderType:1,
        keyword: ""
      },
      temp: {
        gameId:'',
        title: "",
        des: "",
        wxImage: "",
        commentImage: "",
        miniImage:''
      },
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
        des: [
          {
            type: "string",
            required: true,
            message: "描述是必须的",
            trigger: "blur"
          }
        ]
      },
      actions: [
        { type: "primary", value: "编辑", click: this.handleUpdate },
        { type: "danger", value: "删除", click: this.handleDelete }
      ]
    };
  },
  created() {
    let {id,name}=this.$route.query
    this.listQuery.gameId=this.temp.gameId = parseInt(id);
    this.name=name;
    this.fetchData();
  },
  methods: {
    // 返回列表
    goBack(){
      this.$router.go(-1);
    },
    // 根据id获取平台文案列表
    fetchData() {
      this.listLoading = true;
      let getFn=this.listQuery.gameId===-1?getPfList:getGameList;
      getFn(this.listQuery).then(response => {
        console.log(response);
        let { totalCount, items } = response.data;
        let list = items||[];
        list.forEach(item=>{
          item.miniImage?null:item.miniImage='';
        })
        console.log(list)
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
            obj.value = key;
            obj.sort=true;
            obj.width = "60";
            head[0] = obj;
            break;
          case "title":
            obj.label = "标题";
            obj.value = key;
            head[1] = obj;
            break;
          case "des":
            obj.label = "描述";
            obj.value = key;
            head[2] = obj;
            break;
          case "wxImage":
            obj.label = "微信分享图";
            obj.value = key;
            obj.isImage = true;
            obj.styleObject = {
              width: "100px",
              height: "100px"
            };
            head[3] = obj;
            break;
          case "commentImage":
            obj.label = "朋友圈分享图";
            obj.value = key;
            obj.isImage = true;
            obj.styleObject = {
              width: "100px",
              height: "100px"
            };
            head[4] = obj;
            break;
          case "miniImage":
            obj.label = "小程序分享图";
            obj.value = key;
            obj.isImage = true;
            obj.styleObject = {
              width: "100px",
              height: "80px"
            };
            head[5] = obj;
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
    // 新增文案
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "添加";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 编辑文案
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "编辑";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 删除
    handleDelete(row) {
      console.log("要删除的id", row.id);
      let fn = this.listQuery.gameId===-1?deletePf:deleteGame;
      fn({id:row.id}).then(() => {
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
        this.total-=1
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
        gameId:this.listQuery.gameId,
        title: "",
        des: "",
        wxImage: "",
        commentImage: ""
      };
    },
    // 数据校验
    checkout() {
      let { wxImage, commentImage, miniImage } = this.temp;
      console.log(miniImage)
      if (wxImage === "" || commentImage === ""||miniImage==="") {
        this.$message({
          message: "请上传图片",
          type: "error",
          duration: 1500 
        });
        return false;
      }
      return true;
    },
    // 新增数据
    createData() {
      if(this.saveLoading)return;
      this.$refs["dataForm"].validate(valid => {
        if (valid&&this.checkout()) {
          this.saveLoading=true;
          const tempData = Object.assign({}, this.temp);
          console.log("createData", tempData);
          let create=this.listQuery.gameId===-1?createPf:createGame;
          create(tempData).then(res => {
            let item=res.data
            this.list.unshift(item);
            if(this.list.length===1)this.getHead(this.list)
            this.total+=1
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 1000,
              onClose:()=>{
                this.saveLoading=false;
              }
            })
          }).catch(()=>{
            this.$notify({
              title: "失败哦",
              message: "创建失败，请重试",
              type: "error",
              duration: 1000,
              onClose:()=>{
                this.saveLoading=false;
              }
            })
          })
        }
      });
    },
    // 编辑数据
    updateData() {
      if(this.saveLoading)return;
      this.$refs["dataForm"].validate(valid => {
        if (valid&&this.checkout()) {
          this.saveLoading=true;
          const tempData=Object.assign({},this.temp);
          console.log("updateData", tempData);
          let update=this.listQuery.gameId===-1?updatePf:updateGame;
          update(tempData).then(res=> {
            let item=res.data;
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
                this.saveLoading=false;
              }
            });
          }).catch(err=>{
            console.log(err)
            this.$notify({
              title: "失败",
              message: "更新失败，请重试",
              type: "error",
              duration: 1000,
              onClose:()=>{
                this.saveLoading=false;
              }
            });
          })
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.app-container {
  .dialog {
    width: 540px;
    margin: 0px auto;
    .form-left {
      float: left;
      width: 530px;
      .wxImage,
      .commentImage {
        display: inline-block;
        width: 262px;
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
