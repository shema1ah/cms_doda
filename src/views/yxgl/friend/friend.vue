<template>
  <div class="inner">
    <span class="title">{{name}} 的朋友圈</span>
    <div class="app-container">
      <!-- 搜索 -->
      <!-- <el-input v-model.number="listQuery.keyword" placeholder="请输入要搜索的uid" style="width: 400px;margin-right: 20px" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <!--搜索按钮 -->
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <!-- 发朋友圈 -->
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">发朋友圈</el-button>
      <!--表格区域-->
      <Table :thead="thead" :list="list||[]" :listLoading="listLoading" :actions="actions" />
      <!--分页区域-->
      <div class="pagination-container" align="right" style="margin-top: 20px;">
        <el-pagination :total="total" :current-page="listQuery.index" :page-size="listQuery.pageSize" background layout="prev, pager, next, jumper" @current-change="handleCurrentChange" />
      </div>
      <!--弹出层-->
      <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
        <div class="dialog">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="min-width: 450px;max-width:1000px;">
            <template v-if="dialogStatus==='发朋友圈'">
              <el-form-item label="内容" prop="content" class="content">
                <el-input :autosize="{ minRows: 3, maxRows: 4}" v-model.trim="temp.content" type="textarea" placeholder="请输入内容" />
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
                <!-- <el-upload :action="'https://luna.ajimiyou.com/luna/image/upload'" ref='myUpload' list-type="picture-card" :limit="6" :on-success="handleImgSuccess" :on-error="handleImgError" :on-preview="handleImgCb" :on-remove="handleImgRemove" :on-exceed="handleImgLimit"> -->
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
                <img width="100%" :src="dialogImageUrl" alt="暂无图片">
              </el-dialog>
            </template>
            <template v-else-if="dialogStatus==='点赞'">
              <el-form-item label="点赞的人" prop="userIds">
                <el-select v-model="temp.userIds" multiple placeholder="请选择点赞的人" style="width:500px">
                  <el-option v-for="npc in npcList" :key="npc.id" :label="npc.nickname" :value="npc.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="评论的人" prop="userId">
                <el-select v-model="temp.userId" placeholder="请选择评论的人" style="width:500px">
                  <el-option v-for="npc in npcList" :key="npc.id" :label="npc.nickname" :value="npc.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="内容" prop="content" class="content">
                <el-input :autosize="{ minRows: 3, maxRows: 4}" v-model.trim="temp.content" type="textarea" placeholder="请输入内容" />
              </el-form-item>
            </template>
          </el-form>
          <div slot="footer" class="dialog-footer clearfix">
            <template v-if="dialogStatus==='发朋友圈'">
              <el-button style="float: left" type="primary" @click="upLoadImgCancel">取消</el-button>
              <el-button style="float: right" type="success" @click="createData">发朋友圈</el-button>
            </template>
            <template v-else>
              <el-button style="float: left" type="primary" @click="dialogFormVisible=!dialogFormVisible">取消</el-button>
              <el-button style="float: right" type="success" @click="dialogStatus=='点赞'?updateFavourSave():updateCommentSave()">{{dialogStatus}}保存</el-button>
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
import { getNpcList } from "../../../api/yxgl/npc.js";
import {
  getFriendList,
  updatefriend,
  updateFavour,
  updateComment
} from "../../../api/yxgl/friend.js";
export default {
  components: {
    Table
  },
  data() {
    return {
      headers: {},
      name: "", //NPC名字
      avatar: "", //NPC头像
      npcList: [], //所有NPC列表
      list: [],
      listLoading: true,
      total: 0,
      thead: [], // 表头信息
      listQuery: {
        userId: "",
        index: 1,
        pageSize: 10,
        orderType: 1
      },
      temp: {
        user: null,
        content: "",
        type: 0
      },
      dialogStatus: "",
      dialogFormVisible: false,
      // 查看图片dialog参数
      dialogImageUrl: "",
      dialogVisible: false,
      images: [], //需要上传的图片数组
      rules: {
        content: [
          {
            type: "string",
            required: true,
            message: "内容是必须的",
            trigger: "blur"
          }
        ],
        userIds: [
          {
            type: "array",
            required: true,
            message: "请选择点赞的人",
            trigger: "change"
          }
        ],
        userId:[
          {
            type: "number",
            required: true,
            message: "请选择评论的人",
            trigger: "change"
          }
        ]
      },
      actions: [
        { type: "primary", value: "点赞", click: this.handleFavour },
        { type: "primary", value: "评论", click: this.handleComment }
      ]
    };
  },
  created() {
    this.getUserId();
    this.fetchData();
    this.fetchNpcData();
  },
  methods: {
    ...mapGetters(["token"]),
    // 获取角色ID
    getUserId() {
      let { userId, name, avatar } = this.$route.query;
      this.listQuery.userId = parseInt(userId);
      this.name = name;
      this.avatar = avatar;
      this.headers = { token: this.token() };
      this.temp.user = { id: userId };
    },
    // 数据处理
    dataFilter(data) {
      if ({}.toString.call(data).slice(8, -1) === "Array") {
        data.forEach(item => {
          let imgs = [];
          let comments = [];
          let favors = [];
          if (item.images) {
            item.images.forEach(img => {
              imgs.push(img.imageUrl);
            });
          }
          if (item.commentList) {
            item.commentList.forEach(comment => {
              comments.push(`${comment.userName}：${comment.content}`);
            });
          }
          if (item.favorList) {
            item.favorList.forEach(favor => {
              favors.push(favor.nickname);
            });
          }
          item.zy_avatar = this.avatar;
          item.zy_imgs = imgs;
          item.zy_comments = comments;
          item.zy_favors = favors;
        });
      } else {
        console.log(data);
        let imgs = [];
        if (data.images) {//是发朋友圈
          data.images.forEach(img => {
            imgs.push(img.imageUrl);
          });
        }
        if (data.type===2) { //是点赞
          let favorList = this.npcList.filter(
            npc => data.userIds.indexOf(npc.id) > -1
          );
          let favors = [];
          favorList.forEach(favor => {
            favors.push(favor.nickname);
          });
          data.zy_favors = favors;
          data.favorList = favorList;
        }
        if(data.type===3){//是评论
          let commentNpc=this.npcList.find(npc => npc.id===data.userId)
          data.zy_comments= [`${commentNpc.nickname}：${data.content}`];
        }
        data.zy_avatar = this.avatar;
        data.zy_imgs = imgs;
      }
      return data;
    },
    // 获取所有NPC
    fetchNpcData() {
      getNpcList(this.listQuery).then(response => {
        console.log("所有NPC列表", response);
        let data = response.data;
        let npcList = [];
        data.forEach((item, index) => {
          if (item.id === this.listQuery.userId) return;
          let obj = {};
          obj.id = item.id;
          obj.nickname = item.nickname;
          npcList.push(obj);
        });
        this.npcList = npcList;
      });
    },
    // 获取当前NPC的朋友圈
    fetchData() {
      getFriendList(this.listQuery).then(response => {
        console.log("当前NPC的朋友圈", response);
        const { items, totalCount } = response.data;
        let list = this.dataFilter(items);
        // 得出表头信息;
        this.getHead(list);
        this.list = list;
        this.total = parseInt(totalCount);
        this.listLoading = false;
      });
    },
    // 根据结果计算出对应的表头
    getHead(res) {
      const head = [];
      for (const key in res[0]) {
        const obj = {};
        obj.sort = false;
        // 按顺序排好
        switch (key) {
          case "zy_avatar":
            obj.label = "头像";
            obj.value = key;
            obj.width = "100";
            obj.isImage = true;
            obj.styleObject = {
              width: "80px",
              height: "80px"
            };
            head[0] = obj;
            break;
          case "content":
            obj.label = "发布的文字";
            obj.value = key;
            obj.width = "250";
            head[1] = obj;
            break;
          case "zy_imgs":
            obj.label = "发布的图片";
            obj.value = key;
            obj.isImage = true;
            obj.width = "198";
            obj.styleObject = {
              width: "80px",
              height: "80px",
              margin: "4px"
            };
            head[2] = obj;
            break;
          case "zy_favors":
            obj.label = "点赞的人";
            obj.value = key;
            obj.isTag = true;
            obj.width = "300";
            head[3] = obj;
            break;
          case "zy_comments":
            obj.label = "评论";
            obj.value = key;
            obj.isTag = true;
            head[4] = obj;
            break;
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
    // 新增按钮
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "发朋友圈";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 取消按钮
    upLoadImgCancel() {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.$refs["myUpload"]?this.$refs["myUpload"].clearFiles():null;
    },
    // 点赞
    handleFavour(row) {
      console.log("点赞", row);
      let userIds = [];
      if (row.favorList && row.favorList.length !== 0) {
        row.favorList.forEach(item => {
          userIds.push(item.id);
        });
      }
      this.temp = Object.assign({}, { momentId: row.id, userIds }); // copy obj
      this.dialogStatus = "点赞";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 点赞保存
    updateFavourSave() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // 解析需要上传的字段
          const tempData = Object.assign({}, this.temp);
          console.log("点赞保存", tempData);
          updateFavour(tempData).then(response => {
            tempData.type=2//2为点赞
            const item = this.dataFilter(tempData);
            for (const v of this.list) {
              if (v.id === item.momentId) {
                v.zy_favors = item.zy_favors;
                v.favorList = item.favorList;
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "点赞成功",
              type: "success",
              duration: 1500
            });
          });
        }
      });
    },
    // 评论
    handleComment(row) {
      console.log("评论", row);
      this.temp = Object.assign({}, { momentId: row.id, userId:'',content:'' });
      this.dialogStatus = "评论";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 评论保存
    updateCommentSave() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // 解析需要上传的字段
          const tempData = Object.assign({}, this.temp);
          console.log("评论保存", tempData);
          updateComment(tempData).then(() => {
            tempData.type=3//类型为3是评论
            const item = this.dataFilter(tempData);
            for (const v of this.list) {
              if (v.id === item.momentId) {
                if(v.zy_comments){
                  v.zy_comments=[...v.zy_comments,...item.zy_comments]
                }else{
                  v.zy_comments=item.zy_comments
                }
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "评论成功",
              type: "success",
              duration: 1500
            });
          });
        }
      });
    },
    // 删除
    // handleDelete(row) {
    //   console.log("要删除的id", row.id);
    //   deleteQuestion({ id: row.id }).then(() => {
    //     const index = this.list.indexOf(row);
    //     this.list.splice(index, 1);
    //     this.$notify({
    //       title: "成功",
    //       message: "用户删除成功",
    //       type: "success",
    //       duration: 1500
    //     });
    //   });
    // },
    // 重置
    resetTemp() {
      this.images = [];
      this.temp = {
        user: { id: this.listQuery.userId },
        content: "",
        type: 0
      };
    },
    // 新增朋友圈
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          if (this.images.length !== 0) {
            tempData.images = this.images;
            tempData.type = 1;
          }
          console.log("createData", tempData);
          updatefriend(tempData).then(response => {
            console.log(response);
            const item = this.dataFilter(tempData);
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
    // updateData() {
    //   this.$refs["dataForm"].validate(valid => {
    //     if (valid) {
    //       // 解析需要上传的字段
    //       const { id, user, title, answers, longPause, momentId } = this.temp;
    //       const tempData = { id, user, title, answers, longPause, momentId };
    //       console.log("updateData", tempData);
    //       updatefriend(tempData).then(() => {
    //         const item = this.dataFilter(tempData);
    //         for (const v of this.list) {
    //           if (v.id === item.id) {
    //             const index = this.list.indexOf(v);
    //             this.list.splice(index, 1, item);
    //             break;
    //           }
    //         }
    //         this.dialogFormVisible = false;
    //         this.$notify({
    //           title: "成功",
    //           message: "更新成功",
    //           type: "success",
    //           duration: 1500
    //         });
    //       });
    //     }
    //   });
    // }
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
    .friendImg {
      display: inline-block;
      width: 282px;
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