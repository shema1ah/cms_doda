<template>
  <div class="imageLoad clearfix">
    <div class="load-inner" :style="{ width:imgWidth+'px', height:imgHeight+'px' }" v-for="(item,index) in imgNum" :key="index">
      <!-- 传入的是字符串 -->
      <template v-if="type===1||type===2">
        <!-- 如果是空字符串或null则代表需要上传 -->
        <template v-if="imageAry[index]==null||imageAry[index]==''">
          <div :id="'upload'+number+index" :style="{ height:imgHeight+'px' }">
            <i class="load-icon el-icon-plus"></i>
            <input class="load-file" type="file" @change="fileChange($event,index)" name="image" />
          </div>
        </template>
        <!-- 否则则代表需要展示图片 -->
        <template v-else>
          <div class="load-img">
            <label class="delete-label">
              <i class="delete el-icon-close" @click="handleDelete(index)"></i>
            </label>
            <img :src="imageAry[index]" alt="暂无图片">
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import $ from "jquery";
import { Loading } from "element-ui";
import { getToken } from "../../utils/auth.js";
/* 
  des:        一个拖拽上传模块,
  loadType(支持的类型):   ['image/jpeg','image/png','video/mp4'],

  A
 */
/*
 * @Author: zhaoyu
 * @Date:   2018-9-16
 * @Last Modified by: zhaoyu
 * @params: {
 *   number    (number) : 该组件在单页中的唯一标识   必须传递
 *   imgNum    (number) : 需要上传的张数           默认为1,
 *   imgWidth  (number) : 上传的图片的宽度         默认为160PX
 *   imgHeight (number) : 上传的图片的高度         默认为100PX
 *   imgs      (array,string): 默认要展示的图片   
 *   imageSrc  (string) : 传入的值如果不是一个纯图片数组，则需要给出的图片所在字段
 * }
 */
import { mapGetters } from "vuex";
export default {
  props: {
    // 引用该组件的唯一标识符
    number: {
      type: Number,
      required: true
    },
    // 需要上传的图片的个数
    imgNum: {
      type: Number,
      default: 1
    },
    // 内层图片宽度
    imgWidth: {
      type: Number,
      default: 160
    },
    // 内层图片高度
    imgHeight: {
      type: Number,
      default: 100
    },
    // v-model 双向绑定的值
    imgs: {
      type: [Array, String]
    },
    // 如果传入的数组不是一个纯图片数组(是一个对象数组,则需要给出图片字段)
    imageSrc: {
      type: String
    }
  },
  model: {
    prop: "imgs", //组件使用时写的v-model绑定的属性，名字可以自定义，但是要跟props中的名字同步
    event: "cc"
  },
  data() {
    return {
      /*
      *  type: 传入的数据类型(默认为1)
      *       1 :传入的是String
      *       2 :传入的是一个纯图片数组
      *       3 :传入的是一个对象数组 
      */
      type: 1
    };
  },
  computed: {
    imageAry() {
      if (this.imageSrc === undefined) {
        if ({}.toString.call(this.imgs).slice(8, -1) === "Array") {
          this.type = 2;
          return this.imgs
        } else {
          this.type = 1;
          return [this.imgs];
        }
      } else {
        this.type = 3;
        return this.imgs
      }
      
    }
  },
  methods: {
    ...mapGetters(["token"]),
    //上传
    fileChange(data, i) {
      let imageFile = data.target.files[0];
      console.log(imageFile.type);
      if (
        !imageFile ||
        [
          "image/jpeg",
          "image/png",
          "image/gif",
          "video/mp3",
          "video/mp4"
        ].indexOf(imageFile.type) === -1
      ) {
        this.$message({
          message: "仅支持jpeg,png,gif,mp3,mp4格式的文件",
          type: "error",
          duration: 1800
        });
        return;
      }
      const options = {
        target: "#upload" + this.number + i,
        background: "white",
        customClass: "imgMask"
      };
      const loaded = Loading.service(options);
      let formData = new FormData();
      formData.append("file", imageFile);
      let headers={
        headers:{
          token:this.token()
        }
      }
      let url = `https://luna.ajimiyou.com/luna/image/upload`;
      // let url = `http://beta.yanxi.api.ajimiyou.com/luna/image/upload`;
      axios.post(url, formData,headers).then(res => {
          console.log("响应结果", res.data);
          let { data } = res.data;
          let result = data; 
          if (this.type === 2) {
            this.imgs[i] = data;
            result = this.imgs.filter(item => item != null);
          }
          this.$emit("cc", result);
          loaded.close();
        })
        .catch(err => {
          console.log("错误结果", err);
          this.$message({
            message: "出错了！*>﹏<* ~ 请重新上传",
            type: "error",
            duration: 1800
          });
          loaded.close();
        });
    },
    // 删除图片
    handleDelete(i) {
      console.log("删除的图片", i);
      let result = "";
      if (this.type === 2) {
        this.imgs[i] = null;
        result = this.imgs.filter(item => item != null);
      }
      this.$emit("cc", result); //删除的时候暂时传空字符串
    }
  }
};
</script>

<style lang='scss' scoped>
.imageLoad {
  position: relative;
  width: 100%;
  border: 1px solid #e5e5e5;
  color: #777;
  font-size: 14px;
  border-radius: 6px;
  text-align: center;
  padding: 5px;
  padding-bottom: 0px;
  background: rgba(204, 204, 204, 0.379);
  .load-inner {
    float: left;
    position: relative;
    transition: background-color 0.2s linear;
    border-radius: 6px;
    background-color: rgba(175, 175, 175, 0.116);
    margin-left: 5px;
    margin-bottom: 5px;
    &:nth-of-type(5n + 1) {
      margin-left: 0px;
    }
    &:hover {
      background-color: rgba(175, 175, 175, 0.281);
    }
    .load-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 28px;
      height: 28px;
      margin-top: -14px;
      margin-left: -14px;
      font-size: 28px;
    }
    .load-file,
    .load-img {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .load-file {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      margin-left: -50%;
    }
    .load-img {
      overflow: hidden;
      border-radius: 3px;
      &:hover {
        .delete-label {
          display: block;
        }
      }
      .delete-label {
        display: none;
        position: absolute;
        right: -17px;
        top: -7px;
        width: 46px;
        height: 26px;
        background-color: #f56c6c;
        border-color: #f56c6c;
        text-align: center;
        transform: rotate(45deg);
        box-shadow: 0 1px 1px #ccc;
        .delete {
          transform: rotate(-45deg);
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
