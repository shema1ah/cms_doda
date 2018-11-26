<template>
  <div class="inner">
    <span class="title">NPC管理</span>
    <div class="app-container">
      <!-- 搜索 -->
      <!-- <el-input v-model.number="listQuery.keyword" placeholder="请输入要搜索的uid" style="width: 400px;margin-right: 20px" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <!--搜索按钮 -->
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <!-- 添加按钮 -->
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">添加NPC</el-button>
      <!-- 添加好友关系 -->
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleShip">添加好友关系</el-button>
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
          <template v-if="dialogStatus === '添加好友关系'">
            <div class="ship">
              <el-form ref="shipForm" :rules="rules" :model="shipTemp" label-position="right" label-width="110px" style="min-width: 450px;max-width:1000px;">
                <el-form-item label="人物" prop="userId">
                  <el-select v-model="shipTemp.userId" placeholder="请选择人物" @change="fetchNpcFocus">
                    <el-option v-for="(item,index) in list" :key="index" :label="item.nickname" :value="item.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="关注的好友" prop="followIds">
                  <el-select v-model="shipTemp.followIds" multiple placeholder="请选择关注的好友" style="width:400px">
                    <el-option v-for="npc in filterList" :key="npc.id" :label="npc.nickname" :value="npc.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <template v-else>
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="min-width: 450px;max-width:1000px;">
              <div class="form-left">
                <el-form-item label="名称" prop="nickname" class="nickname">
                  <el-input v-model.trim="temp.nickname" />
                </el-form-item>
                <el-form-item label="国家" prop="country" class="country">
                  <el-input v-model.trim="temp.country" />
                </el-form-item>
                <el-form-item label="人物形象" prop="virtualType" class="virtualType">
                  <el-select v-model="temp.virtualType" placeholder="请选择人物形象">
                    <el-option label="好人" :value="0" />
                    <el-option label="坏人" :value="1" />
                  </el-select>
                </el-form-item>
                <el-form-item label="剧本" prop="sequence" class="sequence">
                  <el-select v-model="temp.sequence" placeholder="请选择是否有剧本">
                    <el-option label="无剧本" :value="0" />
                    <el-option label="有剧本" :value="1" />
                  </el-select>
                </el-form-item>
                <el-form-item label="个性签名" prop="signature" class="signature">
                  <el-input :autosize="{ minRows: 3, maxRows: 5}" v-model.trim="temp.signature" type="textarea" placeholder="请输入个性签名" />
                </el-form-item>
                <el-form-item label="人物描述" class="des">
                  <el-input :autosize="{ minRows: 5, maxRows: 6}" v-model.trim="temp.des" type="textarea" placeholder="请输入个性签名" />
                </el-form-item>
                <el-form-item label="头像" class="avatar">
                  <Dropzone v-model="temp.avatar" :number="0" :imgWidth="150" :imgHeight="150"></Dropzone>
                </el-form-item>
                <el-form-item label="封面" label-width="90px" class="cover">
                  <Dropzone v-model="temp.cover" :number="1" :imgWidth="150" :imgHeight="150"></Dropzone>
                </el-form-item>
              </div>
              <div class="form-right">
                <el-form-item label="解锁成功" label-width="68px" class="successCard">
                  <Dropzone v-model="temp.successCard" :number="2" :imgWidth="320" :imgHeight="500"></Dropzone>
                </el-form-item>
              </div>
            </el-form>
          </template>
          <div slot="footer" class="dialog-footer clearfix">
            <el-button style="float: left" type="primary" @click="dialogFormVisible=!dialogFormVisible">取消</el-button>
            <template v-if="dialogStatus==='添加好友关系'">
              <el-button style="float: right" type="success" @click="createShip()">保存</el-button>
            </template>
            <template v-else>
              <el-button style="float: right" type="success" @click="dialogStatus==='编辑'?updateData():createData()">{{dialogStatus=='编辑'?'保存':'添加'}}</el-button>
            </template>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Table from "@/components/Table";
import Dropzone from "../../../components/Dropzone";
import {
  getNpcList,
  createNpc,
  updateNpc,
  deleteNpc,
  getNpcfocus,
  updateNpcfocus
} from "../../../api/yxtest/npc.js";
export default {
  components: {
    Table,
    Dropzone
  },
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0,
      thead: [], //表头信息
      listQuery: {
        index: 1,
        pageSize: 10,
        orderType: 1
      },
      temp: {
        nickname: "",
        avatar: "", //头像地址
        cover: "", //封面地址
        successCard: "", //成就解锁图
        signature: "", //个性签名
        sex: 0, //性别 0-未知，1-男，2-女
        country: "中国", //国家
        type: 1, //是NPC
        sequence: 0, //有无剧本
        virtualType: 0, //npc正反面形象，0 好人，1 坏人
        des: "" //npc 简介
      },
      shipTemp: {
        userId: "",
        followIds: []
      },
      dialogStatus: "",
      dialogFormVisible: false,
      rules: {
        nickname: [
          {
            type: "string",
            required: true,
            message: "名字是必须的",
            trigger: "blur"
          }
        ],
        country: [
          {
            type: "string",
            required: true,
            message: "国家是必须的",
            trigger: "blur"
          }
        ],
        signature: [
          {
            type: "string",
            required: true,
            message: "个性签名是必须的",
            trigger: "blur"
          }
        ],
        sex: [
          {
            type: "number",
            required: true,
            message: "性别是必须的",
            trigger: "blur"
          }
        ],
        virtualType: [
          {
            type: "number",
            required: true,
            message: "人物形象是必须的",
            trigger: "blur"
          }
        ],
        sequence: [
          {
            type: "number",
            required: true,
            message: "剧本选择是必须的",
            trigger: "blur"
          }
        ],
        userId: [
          {
            type: "number",
            required: true,
            message: "人物是必须的",
            trigger: "blur"
          }
        ],
        followIds: [
          {
            type: "array",
            required: true,
            message: "请选择要关注的好友",
            trigger: "change"
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
    this.fetchData();
  },
  computed: {
    filterList() {
      return this.list.filter(item => item.id !== this.shipTemp.userId);
    }
  },
  methods: {
    // 数据处理
    dataFilter(data) {
      if ({}.toString.call(data).slice(8, -1) === "Array") {
        data.forEach(item => {
          item.zh_type = item.virtualType === 0 ? "好人" : "坏人";
        });
      } else {
        data.zh_type = data.virtualType === 0 ? "好人" : "坏人";
      }
      return data;
    },
    // 获取所有NPC列表
    fetchData() {
      getNpcList(this.listQuery).then(response => {
        console.log(response);
        let { data } = response;
        let list = this.dataFilter(data);
        // 得出表头信息
        this.getHead(list);
        this.list = list;
        // this.total = parseInt(totalCount);
        this.listLoading = false;
      });
    },
    // 选择对应的NPC出现对应的关注好友
    fetchNpcFocus() {
      console.log(this.shipTemp);
      let { userId } = this.shipTemp;
      getNpcfocus({ id: userId }).then(response => {
        let ary = [];
        let data = response.data;
        data.forEach(item => {
          if (item.id === userId) return;
          ary.push(item.id);
        });
        this.shipTemp.followIds = ary;
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
          case "nickname":
            obj.label = "名称";
            obj.width = "100";
            obj.value = key;
            head[0] = obj;
            break;
          case "avatar":
            obj.label = "头像";
            obj.value = key;
            obj.isImage = true;
            obj.styleObject = {
              width: "100px",
              height: "100px"
            };
            head[1] = obj;
            break;
          case "signature":
            obj.label = "个性签名";
            obj.value = key;
            head[2] = obj;
            break;
          case "des":
            obj.label = "人物描述";
            obj.value = key;
            head[3] = obj;
            break;
          case "zh_type":
            obj.label = "人物形象";
            obj.width = "60";
            obj.value = key;
            head[4] = obj;
            break;
          case "cover":
            obj.label = "封面";
            obj.value = key;
            obj.isImage = true;
            obj.styleObject = {
              width: "200px",
              height: "150px"
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
    // 新增NPC按钮
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "添加";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 新增好友关系按钮
    handleShip() {
      this.shipTemp = { userId: "", followIds: [] };
      this.dialogStatus = "添加好友关系";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["shipForm"].clearValidate();
      });
    },
    // 编辑
    handleUpdate(row) {
      this.temp = Object.assign(
        row.successCard ? { successCard: "" } : {},
        row
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
      deleteNpc({ id: row.id }).then(() => {
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
        nickname: "",
        avatar: "", //头像地址
        cover: "", //封面地址
        successCard: "", //成就解锁图
        signature: "", //个性签名
        sex: 0, //性别 0-未知，1-男，2-女
        country: "中国", //国家
        type: 1, //是NPC
        sequence: 0, //有无剧本
        virtualType: 0, //npc正反面形象，0 好人，1 坏人
        des: "" //npc 简介
      };
    },
    // 新增数据 TODO
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.temp.avatar === "") {
            this.$message({
              message: "头像是必须的",
              type: "error",
              duration: 1500
            });
            return;
          }
          const tempData = Object.assign({}, this.temp);
          console.log("createData", tempData);
          createNpc(tempData).then(() => {
            let item = this.dataFilter(tempData);
            this.list.unshift(item);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    // 新增好友关系
    createShip() {
      this.$refs["shipForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.shipTemp);
          console.log("createShip", tempData);
          updateNpcfocus(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "关注成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    // 编辑数据
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (this.temp.avatar === "") {
            this.$message({
              message: "头像是必须的",
              type: "error",
              duration: 1500
            });
            return;
          }
          // 解析需要上传的字段
          let {
            id,
            nickname,
            country,
            sex,
            virtualType,
            sequence,
            signature,
            des,
            avatar,
            cover,
            successCard
          } = this.temp;
          const tempData = {
            id,
            nickname,
            country,
            sex,
            virtualType,
            sequence,
            signature,
            des,
            avatar,
            cover,
            successCard
          };
          console.log("updateData", tempData);
          updateNpc(tempData).then(() => {
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
              duration: 2000
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
    width: 930px;
    margin: 0px auto;
    .ship {
      width: 520px;
      margin: 20px auto;
    }
    .form-left {
      float: left;
      width: 530px;
      .nickname,
      .country,
      .sex,
      .virtualType,
      .sequence {
        display: inline-block;
        width: 260px;
      }
      .avatar {
        display: inline-block;
        width: 272px;
      }
      .cover {
        display: inline-block;
        width: 252px;
      }
      .signature,
      .des {
        display: inline-block;
        width: 530px;
      }
    }
    .form-right {
      float: right;
      width: 399px;
    }
    .dialog-footer {
      display: block;
      width: 234px;
      margin: 10px auto;
      margin-top: 2px;
    }
  }
}
</style>
