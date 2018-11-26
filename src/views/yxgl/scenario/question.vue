<template>
  <div class="inner">
    <span class="title">{{name}} 的剧本</span>
    <div class="app-container">
      <!-- 搜索 -->
      <!-- <el-input v-model.number="listQuery.keyword" placeholder="请输入要搜索的uid" style="width: 400px;margin-right: 20px" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <!--搜索按钮 -->
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <!-- 添加按钮 -->
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
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="min-width: 450px;max-width:1000px;">
            <el-form-item label="问题" prop="title" class="title">
              <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="temp.title" type="textarea" placeholder="请输入问题" />
            </el-form-item>
            <el-form-item label="长停顿" class="longPause">
              <el-checkbox v-model="temp.longPause">{{temp.longPause?'是':'否'}}</el-checkbox>
            </el-form-item>
            <div class="contentAry" v-for="(answer,index) in temp.answers" :key="index">
              <el-form-item class="content" :rules="rules.content" :prop="'answers['+index+'].content'" :label="index+1 | toChinese">
                <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model.trim="answer.content" type="textarea" placeholder="请输入选项内容" />
              </el-form-item>
              <el-form-item label="选项得分" class="score" :rules="rules.score" :prop="'answers['+index+'].score'">
                <el-input v-model.trim.number="answer.score" style="width: 65px" />
              </el-form-item>
            </div>
            <template v-if="dialogStatus==='添加'">
              <!-- 朋友圈部分暂时不需要 -->
              <el-form-item label="发布朋友圈" style="margin-bottom:6px">
                <el-checkbox class="friend" v-model="temp.levelUp">{{temp.levelUp?'是':'否'}}</el-checkbox>
              </el-form-item>
              <template v-if="temp.levelUp">
                <el-form-item label="内容" prop="moment.content">
                  <el-input :autosize="{ minRows: 3, maxRows: 4}" v-model.trim="temp.moment.content" type="textarea" placeholder="请输要发布朋友圈的内容" />
                </el-form-item>
                <el-form-item label="图片">
                  <el-upload :action="'https://luna.ajimiyou.com/luna/image/upload'" 
                             :headers="headers" 
                             ref='myUpload'
                             list-type="picture-card" 
                             :limit="6"
                             :on-success="handleImgSuccess" 
                             :on-error="handleImgError" 
                             :on-preview="handleImgCb" 
                             :on-remove="handleImgRemove"
                             :on-exceed="handleImgLimit"
                  >
                  <!-- <el-upload 
                  :action="'https://luna.ajimiyou.com/luna/image/upload?token='+token()" 
                  ref='myUpload' 
                  list-type="picture-card" 
                  :limit="6" 
                  :on-success="handleImgSuccess" 
                  :on-error="handleImgError" 
                  :on-preview="handleImgCb" 
                  :on-remove="handleImgRemove" 
                  :on-exceed="handleImgLimit"> -->
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
                <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
                  <img width="100%" :src="dialogImageUrl" alt="暂无图片">
                </el-dialog>
              </template>
            </template>
          </el-form>
          <div slot="footer" class="dialog-footer clearfix">
            <template v-if="dialogStatus==='编辑'">
              <el-button style="float: left" type="primary" @click="dialogFormVisible=!dialogFormVisible">取消</el-button>
              <el-button style="float: right" type="success" @click="updateData">保存</el-button>
            </template>
            <template v-else>
              <el-button style="float: left" type="primary" @click="upLoadImgCancel">取消</el-button>
              <el-button style="float: right" type="success" @click="createData">添加</el-button>
            </template>

          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Table from "@/components/Table";
import { mapGetters } from "vuex";
import {
  getQuestionList,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from "../../../api/yxgl/scenario.js";
export default {
  components: {
    Table
  },
  filters: {
    toChinese(status) {
      const statusMap = {
        1: "选项一",
        2: "选项二",
        3: "选项三",
        4: "四",
        5: "五"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      headers:{},
      name: "", //NPC的名字
      list: [],
      listLoading: true,
      total: 0,
      thead: [], //表头信息
      listQuery: {
        userId: null,
        index: 1,
        pageSize: 10,
        orderType: 1
      },
      temp: {
      },
      dialogStatus: "",
      dialogFormVisible: false,
      // 查看图片dialog参数
      dialogImageUrl: "",
      dialogVisible: false,
      images: [], //需要上传的图片数组
      rules: {
        title: [
          {
            type: "string",
            required: true,
            message: "问题是必须的",
            trigger: "blur"
          }
        ],
        content: [
          {
            type: "string",
            required: true,
            message: "选项内容是必须的",
            trigger: "blur"
          }
        ],
        score: [
          {
            type: "number",
            required: true,
            message: "分数是必须的",
            trigger: "blur"
          }
        ],
        "moment.content": [
          {
            type: "string",
            required: true,
            message: "内容是必须的",
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
    this.getUserId();
    this.fetchData();
  },
  methods: {
    ...mapGetters(["token"]),
    // 获取角色ID
    getUserId() {
      let { userId, name } = this.$route.query;
      this.listQuery.userId = parseInt(userId);
      this.name = name;
      this.headers = { token: this.token() };
    },
    // 数据处理
    dataFilter(data) {
      if ({}.toString.call(data).slice(8, -1) === "Array") {
        data.forEach(item => {
          item.answers.forEach((answer, index) => {
            item["content" + answer.sequence] = answer.content;
            item["score" + answer.sequence] = answer.score;
          });
        });
      } else {
        data.answers.forEach((answer, index) => {
          data["content" + (index + 1)] = answer.content;
          data["score" + (index + 1)] = answer.score;
        });
      }
      return data;
    },
    // 获取具有剧本的NPC列表
    fetchData() {
      getQuestionList(this.listQuery).then(response => {
        let { items, totalCount } = response.data;
        let list = this.dataFilter(items);
        console.log(list);
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
          case "title":
            obj.label = "问题";
            obj.value = key;
            head[0] = obj;
            break;
          case "content1":
            obj.label = "答案一";
            obj.value = key;
            head[1] = obj;
            break;
          case "score1":
            obj.label = "分数一";
            obj.value = key;
            obj.width = "76px";
            head[2] = obj;
            break;
          case "content2":
            obj.label = "答案二";
            obj.value = key;
            head[3] = obj;
            break;
          case "score2":
            obj.label = "分数二";
            obj.value = key;
            obj.width = "76px";
            head[4] = obj;
            break;
          case "content3":
            obj.label = "答案三";
            obj.value = key;
            head[5] = obj;
            break;
          case "score3":
            obj.label = "分数三";
            obj.value = key;
            obj.width = "76px";
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
    // 上传图片处理
    uploadImgFilter(data) {
      let imgs = [];
      data.forEach((item, index) => {
        let obj = {};
        obj.imageUrl = item.response.data;
        obj.sequence = index + 1;
        imgs.push(obj);
      });
      this.images = imgs;
    },
    // 上传成功的回调
    handleImgSuccess(res, file, fileList) {
      console.log(res, file, fileList);
      this.uploadImgFilter(fileList);
    },
    // 上传失败的回调
    handleImgError(err) {
      console.log("上传图片失败", err);
      this.$message({
        type: "error",
        message: "上传图片失败",
        duration: 1500
      });
    },
    // 点击看图的回调
    handleImgCb(file) {
      console.log("查看图片成功", file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 移除已经上传的文件
    handleImgRemove(file, fileList) {
      console.log("移除上传图片成功", fileList);
      this.uploadImgFilter(fileList);
    },
    // 超过上传限制的回调
    handleImgLimit() {
      this.$message({
        message: "最多上传6张图片",
        type: "error",
        duration: 1800
      });
    },
    // 取消按钮
    upLoadImgCancel() {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.$refs["myUpload"]?this.$refs["myUpload"].clearFiles():null;
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
    // 删除
    handleDelete(row) {
      console.log("要删除的id", row.id);
      deleteQuestion({ id: row.id }).then(() => {
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
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
        user: { id: this.listQuery.userId },
        title: "",
        answers: [
          {
            content: "",
            score: null
          },
          {
            content: "",
            score: null
          },
          {
            content: "",
            score: null
          }
        ],
        levelUp: false,
        longPause: false,
        momentId: "",
        moment: {
          user: { id: this.listQuery.userId },
          content: "",
          type: 0
        }
      };
    },
    // 新增数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let tempData = null;
          let { levelUp, moment, ...res } = this.temp;
          if (levelUp) {
            if (this.images.length !== 0) {
              moment.images = this.images;
              moment.type = 1;
            }
            tempData = Object.assign({}, { levelUp, moment, ...res });
          } else {
            tempData = Object.assign({}, { levelUp, ...res });
          }
          console.log("createData", tempData);
          createQuestion(tempData).then(() => {
            let item = this.dataFilter(tempData);
            this.list.unshift(item);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 1500
            });
          });
        }
      });
    },
    // 编辑数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // 解析需要上传的字段
          let { id, user, title, answers, longPause, momentId } = this.temp;
          const tempData = { id, user, title, answers, longPause, momentId };
          console.log("updateData", tempData);
          updateQuestion(tempData).then(() => {
            let item = this.dataFilter(tempData);
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
  .dialog {
    width: 740px;
    margin: 0px auto;
    .title {
      display: inline-block;
      width: 500px;
    }
    .longPause {
      display: inline-block;
      width: 150px;
      // margin:20px 0 0 30px;
      // vertical-align: top;
    }
    .contentAry {
      .content {
        display: inline-block;
        width: 500px;
      }
      .score {
        display: inline-block;
        width: 200px;
        vertical-align: middle;
      }
    }
    .friendContent {
      width: 680px;
    }
    .dialog-footer {
      display: block;
      width: 234px;
      margin: 10px auto;
      margin-top: 4px;
    }
  }
}
</style>
