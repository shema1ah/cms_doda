(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-2bd7"],{"3cpS":function(t,e,a){},"FY/x":function(t,e,a){"use strict";var n=a("3cpS");a.n(n).a},RQLe:function(t,e,a){"use strict";a.d(e,"c",function(){return i}),a.d(e,"a",function(){return s}),a.d(e,"e",function(){return r}),a.d(e,"b",function(){return c}),a.d(e,"d",function(){return o});var n=a("t3Un");function i(t){return Object(n.a)({url:"/game/list",method:"post",data:t})}function s(t){return Object(n.a)({url:"/game/add",method:"post",data:t})}function r(t){return Object(n.a)({url:"/game/update",method:"post",data:t})}function c(t){return Object(n.a)({url:"/game/delete",method:"post",data:{id:t}})}function o(t){return Object(n.a)({url:"/game/move",method:"post",params:t})}},nxIN:function(t,e,a){"use strict";a.r(e);var n=a("RQLe"),i=a("XJYT"),s={data:function(){return{list:[],total:0,loading:!1,listQuery:{index:1,pageSize:14,keyword:""}}},created:function(){this.fetchData()},methods:{fetchData:function(){var t=this,e=i.Loading.service({fullscreen:!0,lock:!0,text:"拼命加载中"});Object(n.c)(this.listQuery).then(function(a){console.log(a);var n=a.data,i=n.items,s=n.totalCount;t.list=i,t.total=parseInt(s),e.close()})},handleCurrentChange:function(t){this.listQuery.index=t,this.fetchData()},handleFilter:function(){this.listQuery.index=1,this.fetchData()},goShareConfig:function(t,e){this.$router.push({path:"/doda/shareConfig",query:{id:t,name:e}})}}},r=(a("FY/x"),a("KHd+")),c=Object(r.a)(s,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"inner"},[t._m(0),t._v(" "),a("div",{staticClass:"app-container"},[a("el-input",{staticClass:"filter-item",staticStyle:{width:"400px","margin-right":"20px","margin-left":"10px"},attrs:{placeholder:"请输入要搜索的内容"},nativeOn:{keyup:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?t.handleFilter(e):null}},model:{value:t.listQuery.keyword,callback:function(e){t.$set(t.listQuery,"keyword",t._n(e))},expression:"listQuery.keyword"}}),t._v(" "),a("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:t.handleFilter}},[t._v("搜索")]),t._v(" "),a("el-row",{staticClass:"dataList"},[a("div",{staticClass:"dataList-inner clearfix"},[a("div",{staticClass:"dataItem",on:{click:function(e){t.goShareConfig(-1,"平台")}}},[a("div",{staticClass:"dataItem-img"},[a("img",{staticClass:"image",attrs:{src:"https://doda.oss-cn-beijing.aliyuncs.com/image/2018/10/9/d595e1539078900909.jpg",alt:"下载图片失败"}})]),t._v(" "),a("div",{staticClass:"dataItem-name"},[t._v("平台分享")])]),t._v(" "),t._l(t.list,function(e){return a("div",{key:e.id,staticClass:"dataItem",on:{click:function(a){t.goShareConfig(e.id,e.name)}}},[a("div",{staticClass:"dataItem-img"},[a("img",{staticClass:"image",attrs:{src:e.coverImage,alt:"下载图片失败"}})]),t._v(" "),a("div",{staticClass:"dataItem-name"},[t._v(t._s(e.name))])])})],2)]),t._v(" "),a("div",{staticClass:"pagination-container"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next, jumper",total:t.total,"current-page":t.listQuery.index,"page-size":t.listQuery.pageSize},on:{"current-change":t.handleCurrentChange}})],1)],1)])},[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"inner-top"},[e("span",{staticClass:"title"},[this._v("游戏列表")])])}],!1,null,"0d97d3c9",null);c.options.__file="gameList.vue";e.default=c.exports}}]);