<template>
  <div class="inner">
    <span class="title">角色管理</span>
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
            <el-form-item label="角色名称" prop="name">
              <el-input v-model.trim="temp.name" style="max-width: 350px" />
            </el-form-item>
            <el-form-item label="拥有的权限">
              <el-checkbox v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
              <el-checkbox-group v-model="temp.zy_menusId" @change="handleCheckChange">
                <el-checkbox style="margin:0 20px 0 0;" v-for="route in allRoutes" :label="route.id" :key="route.id">{{route.name}}</el-checkbox>
              </el-checkbox-group>
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
  getRolesList,
  createRole,
  updateRole,
  deleteRole
} from "../../api/role/index.js";
import { getRoutesList } from "../../api/routers/index.js";
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
      checkAll: false, //是否全选
      allRoutes: [], //所有路由选项
      allRoutesId: [], //所有路由ID数组
      dialogStatus: "",
      dialogFormVisible: false,
      rules: {
        name: [
          {
            type: "string",
            required: true,
            message: "角色名称是必须的",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.fetchData();
    this.fetchRoutesData();
  },
  methods: {
    // 数据处理
    dealData(data, type) {
      if (type) {
        let { id, name, zy_menusId } = data;
        let menus = this.allRoutes.filter(
          item => zy_menusId.indexOf(item.id) > -1
        );
        let obj = id ? { id, name, menus } : { name, menus };
        return obj;
      }
      data = data || [];
      data.forEach(item => {
        let zy_menus = [];
        let zy_menusId = [];
        item.menus.forEach(menu => {
          zy_menus.push(menu.name);
          zy_menusId.push(menu.id);
        });
        item.zy_menus = zy_menus;
        item.zy_menusId = zy_menusId;
      });
      return data;
    },
    // 获取角色列表数据
    fetchData() {
      this.listLoading = true;
      getRolesList(this.listQuery).then(response => {
        let { items, totalCount } = response.data;
        const list = this.dealData(items);
        console.log(list);
        // 得出表头信息
        this.getHead(list);
        this.list = list;
        this.total = parseInt(totalCount);
        this.listLoading = false;
      });
    },
    // 获取所有路由数据
    fetchRoutesData() {
      getRoutesList({ ...this.listQuery, pageSize: 30 }).then(response => {
        console.log(response);
        let { items, totalCount } = response.data;
        items = items || [];
        let allRoutesId = [];
        items.forEach(item => {
          allRoutesId.push(item.id);
        });
        this.allRoutes = items;
        this.allRoutesId = allRoutesId;
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
            obj.width = "120";
            obj.sort = true;
            obj.value = key;
            head[0] = obj;
            break;
          case "name":
            obj.label = "角色名称";
            obj.width = "220";
            obj.value = key;
            head[1] = obj;
            break;
          case "zy_menus":
            obj.label = "拥有权限";
            obj.value = key;
            obj.isTag = true;
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
    // 权限全选
    handleCheckAll(val) {
      this.temp.zy_menusId = val ? this.allRoutesId : [];
    },
    // 选择change
    handleCheckChange(val) {
      this.checkAll = val.length === this.allRoutesId.length;
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
      this.checkAll = row.menus.length === this.allRoutes.length ? true : false;
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "编辑";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 删除数据
    handleDelete(row) {
      console.log("删除角色", row);
      deleteRole({ id: row.id }).then(() => {
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
        this.total = this.total - 1;
        this.$notify({
          title: "成功",
          message: "角色删除成功",
          type: "success",
          duration: 1500
        });
      });
    },
    // 重置
    resetTemp() {
      (this.checkAll = false),
        (this.temp = {
          name: "",
          menus: [],
          zy_menusId: []
        });
    },
    // 新增数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let tempData = Object.assign({}, this.temp);
          tempData = this.dealData(tempData, 1);
          console.log("createData", tempData);
          createRole(tempData).then(res => {
            const item = this.dealData([res.data])[0];
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
          let tempData = Object.assign({}, this.temp);
          tempData = this.dealData(tempData, 1);
          console.log("updateData", tempData);
          updateRole(tempData).then(res => {
            const item = this.dealData([res.data])[0];
            console.log(item);
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
    width: 800px;
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
