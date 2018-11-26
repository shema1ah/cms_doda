<template>
  <div class="inner">
    <span class="title">哆哒作品审核</span>
    <div class="app-container">
      <!-- 搜索 -->
      <el-input v-model.number="listQuery.keyword" placeholder="请输入要搜索的内容" style="width: 400px;margin-right: 20px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <!--新增数据-->
      <!-- <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">新增数据</el-button> -->
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
            <!-- <el-form-item label="评分" prop="rate" class="rate">
              <el-input v-model.trim.number="temp.rate" disabled />
            </el-form-item> -->
            <el-form-item label="icon" class="icon" label-width="50px">
              <Dropzone v-model="temp.icon" :number="1" :imgWidth="70" :imgHeight="70"></Dropzone>
            </el-form-item>
            <el-form-item label="简介" prop="summary" class="summary">
              <el-input v-model.trim="temp.summary" style="max-width: 700px" />
            </el-form-item>
            <el-form-item label="详细介绍" prop="des" style="width: 932px">
              <el-input :autosize="{ minRows: 3, maxRows: 4}" v-model.trim="temp.des" type="textarea" placeholder="请输入详细介绍" />
            </el-form-item>
            <el-form-item label="轮播图" style="margin-bottom: 5px;">
              <Dropzone v-model="temp.imgs" :number="2" :imgNum='5' :imgWidth="162" :imgHeight="120"></Dropzone>
            </el-form-item>
            <el-form-item label="封面图" class="coverImage">
              <Dropzone v-model="temp.coverImage" :number="0" :imgWidth="180" :imgHeight="120"></Dropzone>
            </el-form-item>
            <el-form-item label="未通过原因">
              <el-input :autosize="{ minRows: 3, maxRows: 4}" v-model.trim="reason" type="textarea" placeholder="请输入详细介绍" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="footer clearfix">
            <el-button style="float: left" type="primary" @click="dialogFormVisible=!dialogFormVisible">取消</el-button>
            <el-button style="float: right" type="success" @click="result(2)">通过</el-button>
            <el-button style="display:block;margin: 0 125px" type="danger" @click="result(3)">未通过</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Table from "@/components/Table";
import Dropzone from "@/components/Dropzone";
import { getCheckList, checkRes, makerCheck } from "../../api/doda/dodaCheck.js";
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
      actions: [{ type: "primary", value: "查看", click: this.handleUpdate }],
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
        ]
      },
      reason: "" //未通过原因
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 数据处理
    dealData(data) {
      data = data || [];
      data.forEach(item => {
        let { id, images } = item;
        item.id = parseInt(id);
        if (images) {
          let imgs = [];
          images.forEach(v => {
            imgs.push(v.image);
          });
          item.imgs = imgs;
        }
        item.rate = item.rate ? item.rate : 9.8;
      });
      return data;
    },
    // 获取文案数据
    fetchData() {
      this.listLoading = true;
      getCheckList(this.listQuery).then(response => {
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
          case "icon":
            obj.label = "icon";
            obj.value = key;
            head[5] = obj;
            obj.isImage = true;
            obj.width = "68";
            obj.styleObject = {
              width: "50px",
              height: "50px"
            };
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
    // 编辑
    handleUpdate(row) {
      console.log(row);
      let item = JSON.parse(JSON.stringify(row));
      let { id, name, summary, des, icon, imgs, coverImage } = item;
      this.temp = Object.assign(
        {},
        {
          id,
          name,
          summary,
          des,
          icon,
          imgs,
          coverImage
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
    // 图片处理
    dealImgs() {
      let { imgs, ...res } = this.temp;
      let images = [];
      imgs.forEach((item, index) => {
        let obj = {};
        obj.image = item;
        images.push(obj);
      });
      return Object.assign({}, { images }, res);
    },
    // 审核通过or未通过
    result(type) {
      if (this.loading) return;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          let tempData = this.dealImgs();
          tempData.state = type
          let obj = { id:tempData.id, stats:type }
          type===3?obj.failureReason = this.reason:null;
          console.log("pass", tempData);
          checkRes(tempData).then(res => {
            console.log(res)
              let item = res.data
              obj.gameId = item.id
              makerCheck(obj).then().catch(err=>{
                makerCheck(obj)
              })
              for (const v of this.list) {
                if (v.id === tempData.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1);
                  this.total = this.total - 1;
                  break;
                }
              }
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "审核成功",
                type: "success",
                onClose: () => { this.loading = false; }
              });
            }).catch(() => {
              this.$notify({
                title: "失败",
                message: "审核失败,请重试",
                type: "error",
                duration: 1000,
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
    .footer {
      display: block;
      width: 330px;
      margin: 15px auto;
      margin-top: 5px;
    }
  }
}
</style>
