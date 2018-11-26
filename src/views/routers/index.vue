<template>
  <div class="inner">
    <span class="title">路由管理</span>
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
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="min-width: 450px;max-width:1000px;">
            <el-form-item label="路由名称" prop="name">
              <el-input v-model.trim="temp.name" style="max-width: 350px" />
            </el-form-item>
            <el-form-item label="路由路径" prop="url">
              <el-input :autosize="{ minRows: 3, maxRows: 4}" v-model.trim="temp.url" type="textarea" placeholder="请输入路径地址" />
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
  getRoutesList,
  createRoute,
  updateRoute,
  deleteRoute
} from "../../api/routers/index.js";
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
        index: 1,
        pageSize: 10,
        keyword: ""
      },
      actions: [
        { type: "primary", value: "编辑", click: this.handleUpdate },
        { type: "danger", value: "删除", click: this.handleDelete }
      ],
      temp: {},
      dialogStatus: "",
      dialogFormVisible: false,
      rules: {
        name: [
          {
            type: "string",
            required: true,
            message: "路由名称是必须的",
            trigger: "blur"
          }
        ],
        url: [
          {
            type: "string",
            required: true,
            message: "路径是必须的",
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
    // 获取路由列表数据
    fetchData() {
      this.listLoading = true;
      getRoutesList(this.listQuery).then(response => {
        console.log(response);
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
            obj.width = "100";
            head[0] = obj;
            break;
          case "name":
            obj.label = "路由名称";
            obj.value = key;
            obj.width = "220";
            head[1] = obj;
            break;
          case "url":
            obj.label = "路径";
            obj.value = key;
            head[2] = obj;
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
        url: ""
      };
    },
    // 新增数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          console.log("createData", tempData);
          createRoute(tempData).then(res => {
            const item = res.data;
            this.list.unshift(item);
            if (this.list.length === 1) this.getHead(this.list);
            this.total = this.total + 1;
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
          const tempData = Object.assign({}, this.temp);
          console.log("updateData", tempData);
          updateRoute(tempData).then(res => {
            const item = res.data;
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
