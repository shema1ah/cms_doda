<template>
  <div class="imageLoad clearfix">
    <div class="load-inner" :style="{ width:imgWidth+'px', height:imgHeight+'px' }" v-for="(item,index) in imgNum" :key="index">
      <!-- 如果是空字符串或null则代表需要上传 -->
      <template v-if="images[index][fieldName]==null||images[index][fieldName]==''">
        <div :class="'uploadNum'+number+index" :style="{ height:imgHeight+'px' }">
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
          <template v-if="images[index][fieldName].split('.').pop()==='mp3'">
            <audio preload="auto" controls :src="images[index][fieldName]">
              您的浏览器不支持audio播放器，请更换或升级浏览器
            </audio>
          </template>
          <template v-else>
            <img :src="images[index][fieldName]" alt="暂无图片">
            </template>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { Loading } from "element-ui";
import { getToken } from "../../utils/auth.js";
/* 
  des:        一个拖拽上传模块,
  loadType(支持的类型):   ['jpeg','png','mp4'],

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
    // 尺寸限制(宽高)
    imgSize: {
      type: String
    },
    // 传入的如果是数组则需要传入图片对应的字段名称
    fieldName: {
      type: String,
      default: "src"
    },
    // 上传类型限制
    uploadType: {
      type: Array,
      default: () => {
        return ["jpeg", "png", "gif", "mp3"];
      }
    }
  },
  model: {
    prop: "imgs", //组件使用时写的v-model绑定的属性，名字可以自定义，但是要跟props中的名字同步
    event: "cc"
  },
  data() {
    return {
      /*
      *   type: 传入的数据类型(默认为1)
      *       1 :传入的是String
      *       2 :传入的是一个对象图片数组
      */
      type: 1
    };
  },
  computed: {
    images() {
      let result = this.imgs;
      if ({}.toString.call(this.imgs).slice(8, -1) === "Array") {
        this.type = 2;
      } else {
        let { imgs, fieldName } = this;
        this.type = 1;
        result = [
          {
            [fieldName]: imgs
          }
        ];
      }
      return result;
    }
  },
  methods: {
    ...mapGetters(["token"]),
    checkout(file) {
      return new Promise((resolve, reject) => {
        // 尺寸校验
        if (this.imgSize) {
          const size = this.imgSize;
          let reader = new FileReader();
          reader.onload = e => {
            let img = new Image();
            img.onload = () => {
              const { width, height } = img;
              if (size !== width + "*" + height) {
                reject(`请上传正确尺寸${size}的图片`);
              } else {
                resolve();
              }
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        } else {
          resolve();
        }
      });
    },
    //上传
    fileChange(data, i) {
      let imageFile = data.target.files[0];
      if (
        !imageFile ||
        this.uploadType.indexOf(imageFile.type.split("/").pop()) === -1
      ) {
        this.$message({
          message: `格式错误，仅支持${this.uploadType.join(",")}格式的文件`,
          type: "error",
          duration: 1800
        });
        return false;
      }
      let fileType = imageFile.type.split("/").pop();
      // 尺寸限制
      this.checkout(imageFile)
        .then(() => {
          const options = {
            target: ".uploadNum" + this.number + i,
            background: "white",
            customClass: "imgMask"
          };
          const loaded = Loading.service(options);
          let formData = new FormData();
          formData.append("file", imageFile);
          const token = this.token();
          let headers = {
            headers: {
              token: token ? token : "palace_yanxi"
            }
          };
          // let url ='http://180.76.105.42:8078/luna/video/upload'
          // let url ='http://180.76.105.42:8078/luna/image/uploadPic'
          let url =
            ["mp3"].indexOf(fileType) === -1
              ? `https://luna.ajimiyou.com/luna/image/uploadPic`
              : `https://luna.ajimiyou.com/luna/video/upload`;
          axios
            .post(url, formData, headers)
            .then(res => {
              console.log("响应结果", res.data);
              let { data } = res.data;
              let result = data;
              if (this.type === 2) {
                this.imgs[i][this.fieldName] = data;
                result = this.imgs;
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
        })
        .catch(msg => {
          this.$message({
            message: msg,
            type: "error",
            duration: 1800
          });
        });
    },
    // 删除图片
    handleDelete(i) {
      let result = "";
      if (this.type === 2) {
        this.imgs[i][this.fieldName] = "";
        result = this.imgs;
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
  color: #777;
  font-size: 14px;
  border-radius: 6px;
  text-align: center;
  background: #fff;
  .load-inner {
    float: left;
    position: relative;
    transition: background-color 0.2s linear;
    border-radius: 6px;
    background-color: #fafafa;
    margin-left: 5px;
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
        line-height: 40px;
        z-index: 9999;
        .delete {
          transform: rotate(-45deg);
          margin-right: -3px;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
      audio {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
