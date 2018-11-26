<template>
  <div class="inner">
    <span class="title">测试朋友圈管理</span>
    <div class="app-container">
      <!-- 搜索 -->
      <!-- <el-input v-model.number="listQuery.keyword" placeholder="请输入要搜索的NPC" style="width: 400px;margin-right: 20px" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <!--表格区域-->
      <Table :thead="thead" :list="list||[]" :listLoading="listLoading" :actions="actions"></Table>
      <!--分页区域-->
      <!-- <div class="pagination-container" align="right" style="margin-top: 20px;">
        <el-pagination background layout="prev, pager, next, jumper" :total="total" :current-page="listQuery.index"
          :page-size="listQuery.pageSize" @current-change="handleCurrentChange">
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>
<script>
import Table from "@/components/Table";
import { getScenarioList } from "../../../api/yxtest/scenario.js";
import { getNpcList } from "../../../api/yxtest/npc.js";
export default {
  components: {
    Table
  },
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0,
      thead: [], //表头信息
      listQuery: {
        userId: "",
        index: 1,
        pageSize: 10
      },
      actions: [{ type: "primary", value: "查看朋友圈", click: this.goFriend }]
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取所有NPC
    fetchData() {
      getNpcList(this.listQuery).then(response => {
        console.log(response);
        let data = response.data;
        data.forEach((item, index) => {
          item.visual = item.virtualType == 1 ? "坏人" : "好人";
        });
        // // 得出表头信息
        this.getHead(data);
        this.list = data;
        // this.total = parseInt(total);
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
          case "nickname":
            obj.label = "名称";
            obj.value = key;
            head[0] = obj;
            break;
          case "avatar":
            obj.label = "头像";
            obj.value = key;
            obj.isImage = true;
            obj.styleObject = {
              height: "80px",
              width: "80px"
            };
            head[1] = obj;
            break;
          case "signature":
            obj.label = "个性签名";
            obj.value = key;
            head[2] = obj;
            break;
          case "visual":
            obj.label = "人物形象";
            obj.value = key;
            head[3] = obj;
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
    }, // 搜索
    /* TODO  */ handleFilter() {
      this.listQuery.index = 1;
      this.fetchData();
    },
    // 跳转到对应的NPC剧本
    goFriend(row) {
      console.log(row);
      let { id, nickname, avatar  }=row
      this.$router.push({
        name: "yxgl/friend/role",
        query: { userId: id, name: nickname, avatar }
      });
    }
    // 删除
    /* handleDelete(row){
        console.log('要删除的id', row.id)
        deleteDodaData(row.id).then(() => {
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
          this.$notify({
            title: "成功",
            message: "用户删除成功",
            type: "success",
            duration: 1500
          });
        });
      }, */
    // 重置
    /* resetTemp(){
        this.temp={
          name:'',
          summary:'',
          des:'',
          rate:''
        }
      }, */
    // 新增数据
    /* createData(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData=Object.assign({},this.temp)
            console.log('createData',tempData);
            createDodaData(tempData).then(() => {
              this.fetchData();
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }, */
    // 编辑数据
    /* updateData(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData=Object.assign({},this.temp);
            tempData.type=tempData.type==='宜'?1:2
            console.log('updateData',tempData);
            updateDodaData(tempData).then(() => {
              this.fetchData();
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 1500
              })
            })
          }
        })
      } */
  }
};
</script>
<style lang="scss">
.app-container {
  .dialog {
    width: 934px;
    margin: 0 auto;
    .rate {
      display: inline-block;
      vertical-align: top;
      margin-top: 35px;
      width: 282px;
    }
    .dialog-footer {
      display: block;
      width: 234px;
      margin: 30px auto;
      margin-top: 20px;
    }
  }
}
</style>
