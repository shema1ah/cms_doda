<template>
  <div class="inner">
    <span class="title">权限管理</span>
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
            <el-form-item label="账号" prop="account">
              <el-input v-model.trim="temp.account" style="max-width: 350px" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model.trim="temp.password" style="max-width: 350px" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model.trim="temp.name" style="max-width: 350px" />
            </el-form-item>
            <el-form-item label="角色" prop="role.id">
              <el-select v-model="temp.role.id" class="filter-item" placeholder="请选择角色" style="max-width: 300px">
                <el-option v-for="role in roleInfo" :key="role.id" :label="role.name" :value="role.id" />
              </el-select>
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
import { mapGetters } from "vuex";
import Table from "@/components/Table";
import {
  getAccessList,
  createAccess,
  updateAccess,
  deleteAccess
} from "../../api/access/access.js";
import { getRolesList } from "../../api/role/index.js";
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
      roleAry: [], //当前用户拥有的角色id
      listQuery: {
        index: 1,
        pageSize: 10,
        orderType: 0,
        keyword: ""
      },
      actions: [
        { type: "primary", value: "编辑", click: this.handleUpdate },
        { type: "danger", value: "删除", click: this.handleDelete }
      ],
      temp: {
        account: "",
        password: "",
        name: "",
        role: {
          id: ""
        }
      },
      roleInfo: [], //所有的角色ID
      dialogStatus: "",
      dialogFormVisible: false,
      rules: {
        account: [
          {
            type: "string",
            required: true,
            message: "账号是必须的",
            trigger: "blur"
          }
        ],
        password: [
          {
            type: "string",
            required: true,
            message: "密码是必须的",
            trigger: "blur"
          }
        ],
        name: [
          {
            type: "string",
            required: true,
            message: "姓名是必须的",
            trigger: "blur"
          }
        ],
        "role.id": [
          {
            required: true,
            message: "角色是必须的",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.roleAry = this.roleId();
    this.fetchData();
    this.fetchRoleData();
  },
  methods: {
    ...mapGetters(["roleId"]),
    // 数据处理
    dealData(data) {
      data = data || [];
      data.forEach(item => {
        item.zy_roleName = item.role ? item.role.name : "暂无角色";
      });
      return data;
    },
    // 获取人员数据
    fetchData() {
      this.listLoading = true;
      getAccessList(this.listQuery).then(response => {
        let { items, totalCount } = response.data;
        const list = this.dealData(items);
        // 得出表头信息
        this.getHead(list);
        this.list = list;
        this.total = parseInt(totalCount);
        this.listLoading = false;
      });
    },
    // 获取角色数据
    fetchRoleData() {
      getRolesList({
        ...this.listQuery,
        pageSize: 30,
        orderType: 1
      }).then(response => {
        let { items, totalCount } = response.data;
        // 根据当前用户拥有权限剔除当前用户没有的角色
        if (this.roleAry !== -1) {
          items = items.filter(item => this.roleAry.indexOf(item.id) > -1);
        }
        this.roleInfo = items;
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
          case "name":
            obj.label = "名字";
            obj.value = key;
            head[1] = obj;
            break;
          case "zy_roleName":
            obj.label = "角色";
            obj.value = key;
            head[2] = obj;
            break;
          case "account":
            obj.label = "账号";
            obj.value = key;
            head[3] = obj;
            break;
          case "password":
            obj.label = "密码";
            obj.value = key;
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
      deleteAccess({ id: row.id }).then(() => {
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
        account: "",
        password: "",
        name: "",
        role: {
          id: ""
        }
      };
    },
    // 新增数据
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          console.log("createData", tempData);
          createAccess(tempData).then(res => {
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
<style lang="scss" scoped>
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
