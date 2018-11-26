<template>
  <div class="inner">
    <span class="title">哆哒数据配置</span>
    <div class="app-container">
      <!-- 搜索 -->
      <el-input v-model.number="listQuery.keyword" placeholder="请输入要搜索的内容" style="width: 400px;margin-right: 20px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
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
        <div class="dialog">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="90px" style="min-width: 450px;max-width:1000px;">
            <el-form-item label="标题" prop="name" class="name">
              <el-input v-model.trim="temp.name" />
            </el-form-item>
            <el-form-item label="评分" prop="rate" class="rate">
              <el-input v-model.trim.number="temp.rate" disabled />
            </el-form-item>
            <el-form-item label="icon" class="icon" label-width="50px">
              <Dropzone v-model="temp.icon" :number="1" :imgWidth="70" :imgHeight="70"></Dropzone>
            </el-form-item>
            <el-form-item label="简介" prop="summary" class="summary">
              <el-input v-model.trim="temp.summary" style="max-width: 700px" />
            </el-form-item>
            <el-form-item label="H5地址" class="onlineUrl">
              <el-input v-model.trim="temp.onlineUrl" style="max-width: 700px" />
            </el-form-item>
            <el-form-item label="详细介绍" prop="des" style="width: 932px">
              <el-input :autosize="{ minRows: 3, maxRows: 4}" v-model.trim="temp.des" type="textarea" placeholder="请输入详细介绍" />
            </el-form-item>
            <el-form-item label="轮播图" style="margin-bottom: 5px;">
              <Dropzone v-model="temp.imgs" :number="2" :imgNum='5' :imgWidth="162" :imgHeight="120"></Dropzone>
            </el-form-item>
            <div class="platforms">
              <span class="stateTag appState">游戏状态</span>
              <span class="stateTag appState">游戏类型</span>
              <el-form-item v-for="(platform,index) in temp.platforms" :key="index" :label="platform.platformType">
                <el-select v-model="platform.state" placeholder="请选择平台状态" style="width:190px">
                  <el-option label="正常" :value="0"></el-option>
                  <el-option label="更新维护" :value="1"></el-option>
                  <el-option label="敬请期待" :value="2"></el-option>
                  <el-option label="隐藏" :value="-1"></el-option>
                </el-select>
                <el-select v-model="platform.playType" placeholder="请选择游戏状态" style="width:190px">
                  <el-option label="H5" :value="0"></el-option>
                  <el-option label="MiniApp" :value="1"></el-option>
                  <el-option label="runtime" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item label="封面图" class="coverImage">
              <Dropzone v-model="temp.coverImage" :number="0" :imgWidth="180" :imgHeight="120"></Dropzone>
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
import Dropzone from "@/components/Dropzone";
import {
  getDodaList,
  createDodaData,
  updateDodaData,
  deleteDodaData,
  siteChange
} from "../../api/doda/doda.js";
export default {
  components: {
    Table,
    Dropzone
  },
  data() {
    return {
      list: [],
      listLoading: true,
      loading: false,
      total: 0,
      totalPage: 0,
      thead: [], //表头信息
      listQuery: {
        index: 1,
        pageSize: 10,
        keyword: ""
      },
      actions: [
        { type: "primary", value: "上移", click: this.changeUp },
        { type: "primary", value: "下移", click: this.changeDown },
        { type: "primary", value: "编辑", click: this.handleUpdate }
        // { type: "danger", value: "删除", click: this.handleDelete },
        
      ],
      temp: {},
      dialogStatus: "",
      dialogFormVisible: false,
      rules: {
        name: [
          {
            type: "string",
            required: true,
            message: "主题是必须的",
            trigger: "blur"
          }
        ],
        summary: [
          {
            type: "string",
            required: true,
            message: "简介是必须的",
            trigger: "blur"
          }
        ],
        des: [
          {
            type: "string",
            required: true,
            message: "详细介绍是必须的",
            trigger: "blur"
          }
        ],
        rate: [
          {
            type: "number",
            required: true,
            message: "评分是必须的,类型需要是数字",
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
    // 匹配平台
    match(val) {
      switch (val) {
        case 1:
          return "iOS";
        case 0:
          return "Android";
        case 2:
          return "miniApp";
        case 3:
          return "H5";
      }
    },
    // 数据处理
    dealData(data) {
      data = data || [];
      data.forEach(item => {
        let { id, images, platforms } = item;
        item.id = parseInt(id);
        if (images) {
          let imgs = [];
          images.forEach(v => {
            imgs.push(v.image);
          });
          item.imgs = imgs;
        }
        if (platforms.length !== 4) {
          let ary = [0, 1, 2, 3];
          platforms.forEach(item => {
            let index = ary.indexOf(item.type);
            ary.splice(index, 1);
          });
          ary.forEach(type => {
            platforms.push({
              type: type,
              state: -1,
              playType: 0,
              platformState: "隐藏",
              platformPlayType: "H5"
            });
          });
        }
        platforms.forEach(item => {
          item.platformType = this.match(item.type);
        });
        item.platforms = platforms;
        let zy_platforms = [];
        item.platforms.forEach(item => {
          let { platformType, platformState, platformPlayType } = item;
          zy_platforms.push(
            `${platformType}：${platformState}，${platformPlayType}`
          );
        });
        item.zy_platforms = zy_platforms;
        item.rate = item.rate ? item.rate : 9.8;
      });
      return data;
    },
    // 获取文案数据
    fetchData() {
      this.listLoading = true;
      getDodaList(this.listQuery).then(response => {
        let { items, total, totalPage } = response.data;
        console.log(items);
        let list = this.dealData(items);
        // 得出表头信息
        this.getHead(list);
        this.list = list;
        this.totalPage = totalPage;
        this.total = parseInt(total);
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
            obj.width = "60";
            head[0] = obj;
            break;
          case "name":
            obj.label = "标题";
            obj.value = key;
            head[1] = obj;
            obj.width = "106";
            break;
          case "coverImage":
            obj.label = "封面图";
            obj.value = key;
            obj.isImage = true;
            obj.width = "100";
            obj.styleObject = {
              width: "80px",
              height: "50px"
            };
            head[2] = obj;
            break;
          case "summary":
            obj.label = "简介";
            obj.value = key;
            obj.width = "190";
            head[3] = obj;
            break;
          case "imgs":
            obj.label = "详情轮播图";
            obj.value = key;
            obj.isImage = true;
            head[4] = obj;
            obj.styleObject = {
              width: "130px",
              height: "90px"
            };
            break;
          case "zy_platforms":
            obj.label = "平台状态";
            obj.value = key;
            obj.isTag = true;
            obj.width = "200";
            head[5] = obj;
            break;
          case "icon":
            obj.label = "icon";
            obj.value = key;
            head[6] = obj;
            obj.isImage = true;
            obj.width = "68";
            obj.styleObject = {
              width: "50px",
              height: "50px"
            };
            break;
          case "rate":
            obj.label = "评分";
            obj.value = key;
            obj.width = "50";
            head[7] = obj;
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
      let item = JSON.parse(JSON.stringify(row));
      let {
        id,
        name,
        summary,
        des,
        icon,
        rate,
        imgs,
        coverImage,
        platforms,
        onlineUrl
      } = item;
      this.temp = Object.assign(
        {},
        {
          id,
          name,
          summary,
          des,
          icon,
          rate,
          imgs,
          coverImage,
          platforms,
          onlineUrl
        }
      ); // copy obj
      this.dialogStatus = "编辑";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 删除
    handleDelete(row) {
      console.log("要删除的id", row.id);
      deleteDodaData(row.id).then(() => {
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
        name: "",
        summary: "",
        des: "",
        rate: 9.8,
        imgs: [],
        icon: "",
        coverImage: "",
        onlineUrl: "",
        platforms: [
          {
            type: 0,
            platformType: "Android",
            state: -1,
            playType: 0
          },
          {
            type: 1,
            platformType: "iOS",
            state: -1,
            playType: 0
          },
          {
            type: 2,
            platformType: "miniApp",
            state: -1,
            playType: 0
          },
          {
            type: 3,
            platformType: "H5",
            state: -1,
            playType: 0
          }
        ]
      };
    },
    // 数据检查
    checkout() {
      let { coverImage, icon, imgs } = this.temp;
      if (coverImage === "" || icon === "" || imgs.length === 0) {
        this.$message({
          message: "请上传必要的图片",
          type: "error",
          duration: 1800
        });
        return false;
      }
      return true;
    },
    // 图片处理
    dealImgs() {
      let { imgs, ...res } = this.temp;
      let images = [];
      imgs.forEach((item, index) => {
        let obj = {};
        obj.image = item;
        obj.sequence = index + 1;
        images.push(obj);
      });
      return Object.assign({}, { images }, res);
    },
    // 位置交换:上移动
    changeUp(row, i) {
      if(this.loading)return;
      console.log(row, i);
      if (this.listQuery.index === 1 && i === 0) {
        this.$message({
          title: "失败",
          message: "第一个无法上移",
          type: "error",
          duration: 1000
        });
        return;
      }

      this.loading=true;
      let data = JSON.parse(JSON.stringify(this.list));
      siteChange({ type: 0, gameId: row.id }).then(res => {
        this.$notify({
          title: "成功",
          message: "上移成功",
          type: "success",
          duration: 800,
          onClose: () => {
            this.loading = false;
          }
        });
        if (i !== 0) {
          let temp = null;
          temp = data[i];
          data[i] = data[i - 1];
          data[i - 1] = temp;
          this.list = data;
          return;
        }
        // 上移的是第一个
        const item = this.dealData([res.data])[0];
        data.splice(i, 1, item);
        this.list = data;
      }).catch(err=>{
        this.$notify({
          title: "失败",
          message: "上移失败",
          type: "err",
          duration: 800,
          onClose: () => {
            this.loading = false;
          }
        });
      })
    },
    // 位置交换:下移动
    changeDown(row, i) {
      if(this.loading)return;
      console.log(row, i);
      let {
        listQuery: { index, pageSize },
        total,
        totalPage
      } = this;
      if (index === totalPage && i === (total % pageSize) - 1) {
        this.$message({
          title: "失败",
          message: "最后一个无法下移",
          type: "error",
          duration: 1000
        });
        return;
      }
      this.loading=true;
      let data = JSON.parse(JSON.stringify(this.list));
      siteChange({ type: 1, gameId: row.id }).then(res => {
        this.$notify({
          title: "成功",
          message: "下移成功",
          type: "success",
          duration: 800,
          onClose: () => {
            this.loading = false;
          }
        });
        if (i !== 9) {
          let temp = null;
          temp = data[i];
          data[i] = data[i + 1];
          data[i + 1] = temp;
          this.list = data;
          return;
        }
        // 下移的是最后一个
        const item = this.dealData([res.data])[0];
        data.splice(i, 1, item);
        this.list = data;
      }).catch(err=>{
        this.$notify({
          title: "失败",
          message: "下移失败",
          type: "err",
          duration: 800,
          onClose: () => {
            this.loading = false;
          }
        });
      })
    },
    // 新增数据
    createData() {
      if (this.loading) return;
      this.$refs["dataForm"].validate(valid => {
        if (valid && this.checkout()) {
          this.loading = true;
          const tempData = this.dealImgs();
          console.log("createData", tempData);
          createDodaData(tempData)
            .then(res => {
              const item = this.dealData([res.data])[0];
              this.list.unshift(item);
              if (this.list.length === 1) this.getHead(this.list);
              this.total = this.total + 1;
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
                duration: 1800,
                onClose: () => {
                  this.loading = false;
                }
              });
            })
            .catch(() => {
              this.$notify({
                title: "失败",
                message: "创建失败，请重试",
                type: "error",
                duration: 1500,
                onClose: () => {
                  this.loading = false;
                }
              });
            });
        }
      });
    },
    // 编辑数据
    updateData() {
      if (this.loading) return;
      this.$refs["dataForm"].validate(valid => {
        if (valid && this.checkout()) {
          this.loading = true;
          const tempData = this.dealImgs();
          console.log("updateData", tempData);
          updateDodaData(tempData)
            .then(res => {
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
                duration: 1800,
                onClose: () => {
                  this.loading = false;
                }
              });
            })
            .catch(() => {
              this.$notify({
                title: "失败",
                message: "更新失败,请重试",
                type: "error",
                duration: 1500,
                onClose: () => {
                  this.loading = false;
                }
              });
            });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.app-container {
  .dialog {
    width: 934px;
    margin: 0 auto;
    .platforms {
      display: inline-block;
      width: 530px;
      .stateTag {
        display: inline-block;
        margin-left: 145px;
        text-align: center;
        font-size: 14px;
        color: #606266;
        line-height: 35px;
      }
    }
    .silders {
      margin-bottom: 10px;
    }
    .name {
      display: inline-block;
      width: 525px;
    }
    .coverImage {
      display: inline-block;
    }
    .icon {
      float: right;
    }
    .summary {
      display: inline-block;
      width: 795px;
    }
    .rate {
      display: inline-block;
      width: 260px;
      vertical-align: top;
    }
    .dialog-footer {
      display: block;
      width: 234px;
      margin: 15px auto;
      margin-top: 5px;
    }
  }
}
</style>
