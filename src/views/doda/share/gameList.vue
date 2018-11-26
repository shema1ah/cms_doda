<template>
  <div class="inner">
    <div class="inner-top">
      <span class="title">游戏列表</span>
    </div>
    <div class="app-container">
      <!-- 搜索 -->
      <el-input v-model.number="listQuery.keyword" placeholder="请输入要搜索的内容" style="width: 400px;margin-right: 20px;margin-left: 10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <!--列表区域-->
      <el-row class="dataList">
        <div class="dataList-inner clearfix">
          <div class="dataItem" @click="goShareConfig(-1,'平台')">
            <div class="dataItem-img">
              <img src="https://doda.oss-cn-beijing.aliyuncs.com/image/2018/10/9/d595e1539078900909.jpg" alt="下载图片失败" class="image">
            </div>
            <div class="dataItem-name">平台分享</div>
          </div>
          <div class="dataItem" @click="goShareConfig(item.id,item.name)" v-for="item in list" :key="item.id">
            <div class="dataItem-img">
              <img :src="item.coverImage" alt="下载图片失败" class="image">
            </div>
            <div class="dataItem-name">{{item.name}}</div>
          </div>
        </div>
      </el-row>
      <!--分页区域-->
      <div class="pagination-container">
        <el-pagination background layout="prev, pager, next, jumper" :total="total" :current-page="listQuery.index" :page-size="listQuery.pageSize" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getDodaList } from "../../../api/doda/doda.js";
import { Loading } from 'element-ui'
export default {
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      listQuery: {
        index: 1,
        pageSize: 14,
        keyword: ""
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取数据列表
    fetchData() {
      const options={ fullscreen: true, lock: true, text: '拼命加载中' };
      const loaded = Loading.service(options)
      getDodaList(this.listQuery).then(response => {
        console.log(response);
        let { items, totalCount } = response.data;
        this.list = items;
        this.total = parseInt(totalCount);
        loaded.close()
      });
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
    // 去编辑文案页面
    goShareConfig(id,name) {
      this.$router.push({
        path:'/doda/shareConfig',
        query:{id,name}
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.inner {
  .app-container {
    padding: 14px 21px!important;
    min-width: 554px;
    .dataList {
      &-inner {
        margin: 20px auto;
        margin-bottom: 0px;
        font-weight: 700;
        font-size: 15px;
        line-height: 18px;
        color: #909399;
        text-align: center;
        .dataItem {
          float: left;
          width: 150px;
          margin: 0px 10px;
          margin-bottom: 20px;
          text-align: center;
          cursor: pointer;
          transition: .4s;
          &:hover {
            transform: scale(1.08)
          }
          &-img {
            width: 100%;
            height: 197px;
            box-shadow: 0px 2px 12px 0 rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
          &-name {
            margin-top: 10px;
            font-size: 14px;
            line-height: 14px;
          }
        }
      }
    }
  }
}
</style>
