(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-3eea"],{"9Pcu":function(t,e,a){"use strict";var n={props:{thead:{type:Array,required:!0},list:{type:Array,required:!0,default:function(){return[]}},actions:{type:Array,default:function(){return[]}},listLoading:{type:Boolean,default:!1}},computed:{},created:function(){},methods:{}},i=(a("SG8p"),a("KHd+")),r=Object(i.a)(n,function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.listLoading,expression:"listLoading"}],staticStyle:{"border-radius":"6px","margin-top":"15px"},attrs:{data:t.list,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[t._l(t.thead,function(e){return a("el-table-column",{key:e.label,attrs:{sortable:e.sort,label:e.label,width:e.width,prop:e.value,align:"center"},scopedSlots:t._u([{key:"default",fn:function(n){return[e.isImage?["Array"==={}.toString.call(n.row[e.value]).slice(8,-1)?a("el-carousel",{attrs:{height:e.styleObject.height,autoplay:!1,"indicator-position":"none",type:"card"}},t._l(n.row[e.value],function(t,n){return a("el-carousel-item",{key:n},[a("img",{style:e.styleObject,attrs:{src:t,alt:"暂无图片"}})])})):a("img",{style:e.styleObject,attrs:{src:n.row[e.value],alt:"暂无图片"}})]:e.isTag?t._l(n.row[e.value],function(e,n){return a("span",{key:n,staticClass:"el-tag el-tag--info el-tag--small",staticStyle:{margin:"4px"}},[a("span",{staticClass:"el-select__tags-text"},[t._v("\n            "+t._s(e)+"\n          ")])])}):[t._v("\n        "+t._s(n.row[e.value])+"\n      ")]]}}])})}),t._v(" "),0!==t.list.length&&0!==t.actions.length?a("el-table-column",{attrs:{label:"操作",align:"center",width:"160","class-name":"small-padding fixed-width"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(t.actions,function(n,i){return a("el-button",{key:n.value,style:{margin:t.actions.length>2?"5px":"0 0 0 10px"},attrs:{type:n.type,size:"mini"},on:{click:function(t){n.click(e.row,e.$index)}}},[t._v(t._s(n.value)+"\n      ")])})}}])}):t._e()],2)},[],!1,null,"5215e21c",null);r.options.__file="index.vue";e.a=r.exports},DKwL:function(t,e,a){"use strict";var n=a("vNtg");a.n(n).a},RLIs:function(t,e,a){"use strict";a.r(e);var n=a("9Pcu"),i=a("qwx8"),r={components:{Table:n.a},data:function(){return{list:[],listLoading:!0,total:0,thead:[],listQuery:{index:1,pageSize:10,keyword:""},actions:[{type:"primary",value:"编辑剧本",click:this.goQuestion}]}},created:function(){this.fetchData()},methods:{fetchData:function(){var t=this;Object(i.d)(this.listQuery).then(function(e){console.log(e);var a=e.data;a.forEach(function(t,e){t.visual=1==t.virtualType?"坏人":"好人"}),t.getHead(a),t.list=a,t.listLoading=!1})},getHead:function(t){var e=[];for(var a in t[0]){var n={sort:!1};switch(a){case"nickname":n.label="名称",n.value=a,e[0]=n;break;case"avatar":n.label="头像",n.value=a,n.isImage=!0,n.styleObject={height:"80px",width:"80px"},e[1]=n;break;case"signature":n.label="个性签名",n.value=a,e[2]=n;break;case"visual":n.label="人物形象",n.value=a,e[3]=n;break;default:continue}}this.thead=e},handleCurrentChange:function(t){this.listQuery.index=t,this.fetchData()},handleFilter:function(){this.listQuery.index=1,this.fetchData()},goQuestion:function(t){console.log(t),this.$router.push({name:"yxgl/scenario/role",query:{userId:t.id,name:t.nickname}})}}},s=(a("DKwL"),a("KHd+")),l=Object(s.a)(r,function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"inner"},[e("span",{staticClass:"title"},[this._v("剧本管理")]),this._v(" "),e("div",{staticClass:"app-container"},[e("Table",{attrs:{thead:this.thead,list:this.list||[],listLoading:this.listLoading,actions:this.actions}})],1)])},[],!1,null,null,null);l.options.__file="index.vue";e.default=l.exports},SG8p:function(t,e,a){"use strict";var n=a("TqJv");a.n(n).a},TqJv:function(t,e,a){},igbY:function(t,e,a){"use strict";e.a={host:"https://api.ajimiyou.com/yanxi/admin"}},qwx8:function(t,e,a){"use strict";a.d(e,"d",function(){return r}),a.d(e,"c",function(){return s}),a.d(e,"a",function(){return l}),a.d(e,"e",function(){return o}),a.d(e,"b",function(){return u});var n=a("t3Un"),i=a("igbY");function r(t){return Object(n.a)({url:"/u/roles",method:"post",proxy:i.a,data:t})}function s(t){return Object(n.a)({url:"/q/list",method:"post",proxy:i.a,data:t})}function l(t){return Object(n.a)({url:"/q/add",method:"post",proxy:i.a,data:t})}function o(t){return Object(n.a)({url:"/q/saveOrUpdate",method:"post",proxy:i.a,data:t})}function u(t){return Object(n.a)({url:"/q/delete",method:"post",proxy:i.a,data:t})}},vNtg:function(t,e,a){}}]);