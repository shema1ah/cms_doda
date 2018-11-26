<template>
  <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="border-radius: 6px;margin-top: 15px">
    <el-table-column v-for="item in thead" :key="item.label" :sortable="item.sort" :label="item.label" :width="item.width" :prop="item.value" align="center">
      <template slot-scope="scope">
        <template v-if='item.isImage'>
          <el-carousel v-if="{}.toString.call(scope.row[item.value]).slice(8,-1)==='Array'" :height="item.styleObject.height" :autoplay="false" indicator-position="none" type="card">
            <el-carousel-item v-for="(img,index) in scope.row[item.value]" :key="index">
              <img :src="img" :style="item.styleObject" alt="暂无图片" />
            </el-carousel-item>
          </el-carousel>
          <img v-else :src="scope.row[item.value]" alt="暂无图片" :style="item.styleObject" />
        </template>
        <template v-else-if="item.isTag">
          <span v-for="(tag,index) in scope.row[item.value]" :key="index" class="el-tag el-tag--info el-tag--small" style="margin:4px">
            <span class="el-select__tags-text">
              {{ tag }}
            </span>
          </span>
        </template>
        <template v-else>
          {{ scope.row[item.value]}}
        </template>
      </template>
    </el-table-column>
    <!--操作-->
    <el-table-column label="操作" v-if="list.length!==0&&actions.length!==0" align="center" width="160" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <el-button :style="{margin:actions.length>2?'5px':'0 0 0 10px'}" v-for="(btn,i) in actions" :key="btn.value" :type="btn.type" size="mini" @click="btn.click(scope.row,scope.$index)">{{btn.value}}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    // 表头信息
    thead: {
      type: Array,
      required: true
    },
    // 数据数组
    list: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    // 是否需要操作项
    actions: {
      type: Array,
      default() {
        return [];
      }
    },
    //  加载中
    listLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  created() {},
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
