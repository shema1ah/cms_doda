(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-66aa"],{"+HKF":function(e,t,a){"use strict";var i=a("4d7F"),n=a.n(i),s=a("QbLZ"),l=a.n(s),r=a("YEIV"),o=a.n(r),c=a("vDqi"),u=a.n(c),d=a("XJYT"),m=(a("X4fA"),a("L2JU")),g={props:{number:{type:Number,required:!0},imgNum:{type:Number,default:1},imgWidth:{type:Number,default:160},imgHeight:{type:Number,default:100},imgs:{type:[Array,String]},imgSize:{type:String},fieldName:{type:String,default:"src"},uploadType:{type:Array,default:function(){return["jpeg","png","gif","mp3"]}}},model:{prop:"imgs",event:"cc"},data:function(){return{type:1}},computed:{images:function(){var e=this.imgs;if("Array"==={}.toString.call(this.imgs).slice(8,-1))this.type=2;else{var t=this.imgs,a=this.fieldName;this.type=1,e=[o()({},a,t)]}return e}},methods:l()({},Object(m.b)(["token"]),{checkout:function(e){var t=this;return new n.a(function(a,i){if(t.imgSize){var n=t.imgSize,s=new FileReader;s.onload=function(e){var t=new Image;t.onload=function(){var e=t.width,s=t.height;n!==e+"*"+s?i("请上传正确尺寸"+n+"的图片"):a()},t.src=e.target.result},s.readAsDataURL(e)}else a()})},fileChange:function(e,t){var a=this,i=e.target.files[0];if(!i||-1===this.uploadType.indexOf(i.type.split("/").pop()))return this.$message({message:"格式错误，仅支持"+this.uploadType.join(",")+"格式的文件",type:"error",duration:1800}),!1;var n=i.type.split("/").pop();this.checkout(i).then(function(){var e={target:".uploadNum"+a.number+t,background:"white",customClass:"imgMask"},s=d.Loading.service(e),l=new FormData;l.append("file",i);var r=a.token(),o={headers:{token:r||"palace_yanxi"}},c=-1===["mp3"].indexOf(n)?"https://luna.ajimiyou.com/luna/image/uploadPic":"https://luna.ajimiyou.com/luna/video/upload";u.a.post(c,l,o).then(function(e){console.log("响应结果",e.data);var i=e.data.data,n=i;2===a.type&&(a.imgs[t][a.fieldName]=i,n=a.imgs),a.$emit("cc",n),s.close()}).catch(function(e){console.log("错误结果",e),a.$message({message:"出错了！*>﹏<* ~ 请重新上传",type:"error",duration:1800}),s.close()})}).catch(function(e){a.$message({message:e,type:"error",duration:1800})})},handleDelete:function(e){var t="";2===this.type&&(this.imgs[e][this.fieldName]="",t=this.imgs),this.$emit("cc",t)}})},p=(a("ki4V"),a("KHd+")),f=Object(p.a)(g,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"imageLoad clearfix"},e._l(e.imgNum,function(t,i){return a("div",{key:i,staticClass:"load-inner",style:{width:e.imgWidth+"px",height:e.imgHeight+"px"}},[null==e.images[i][e.fieldName]||""==e.images[i][e.fieldName]?[a("div",{class:"uploadNum"+e.number+i,style:{height:e.imgHeight+"px"}},[a("i",{staticClass:"load-icon el-icon-plus"}),e._v(" "),a("input",{staticClass:"load-file",attrs:{type:"file",name:"image"},on:{change:function(t){e.fileChange(t,i)}}})])]:[a("div",{staticClass:"load-img"},[a("label",{staticClass:"delete-label"},[a("i",{staticClass:"delete el-icon-close",on:{click:function(t){e.handleDelete(i)}}})]),e._v(" "),"mp3"===e.images[i][e.fieldName].split(".").pop()?[a("audio",{attrs:{preload:"auto",controls:"",src:e.images[i][e.fieldName]}},[e._v("\n            您的浏览器不支持audio播放器，请更换或升级浏览器\n          ")])]:[a("img",{attrs:{src:e.images[i][e.fieldName],alt:"暂无图片"}})]],2)]],2)}))},[],!1,null,"ffb09534",null);f.options.__file="new.vue";t.a=f.exports},"96ms":function(e,t,a){},"9Pcu":function(e,t,a){"use strict";var i={props:{thead:{type:Array,required:!0},list:{type:Array,required:!0,default:function(){return[]}},actions:{type:Array,default:function(){return[]}},listLoading:{type:Boolean,default:!1}},computed:{},created:function(){},methods:{}},n=(a("SG8p"),a("KHd+")),s=Object(n.a)(i,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.listLoading,expression:"listLoading"}],staticStyle:{"border-radius":"6px","margin-top":"15px"},attrs:{data:e.list,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[e._l(e.thead,function(t){return a("el-table-column",{key:t.label,attrs:{sortable:t.sort,label:t.label,width:t.width,prop:t.value,align:"center"},scopedSlots:e._u([{key:"default",fn:function(i){return[t.isImage?["Array"==={}.toString.call(i.row[t.value]).slice(8,-1)?a("el-carousel",{attrs:{height:t.styleObject.height,autoplay:!1,"indicator-position":"none",type:"card"}},e._l(i.row[t.value],function(e,i){return a("el-carousel-item",{key:i},[a("img",{style:t.styleObject,attrs:{src:e,alt:"暂无图片"}})])})):a("img",{style:t.styleObject,attrs:{src:i.row[t.value],alt:"暂无图片"}})]:t.isTag?e._l(i.row[t.value],function(t,i){return a("span",{key:i,staticClass:"el-tag el-tag--info el-tag--small",staticStyle:{margin:"4px"}},[a("span",{staticClass:"el-select__tags-text"},[e._v("\n            "+e._s(t)+"\n          ")])])}):[e._v("\n        "+e._s(i.row[t.value])+"\n      ")]]}}])})}),e._v(" "),0!==e.list.length&&0!==e.actions.length?a("el-table-column",{attrs:{label:"操作",align:"center",width:"160","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return e._l(e.actions,function(i,n){return a("el-button",{key:i.value,style:{margin:e.actions.length>2?"5px":"0 0 0 10px"},attrs:{type:i.type,size:"mini"},on:{click:function(e){i.click(t.row,t.$index)}}},[e._v(e._s(i.value)+"\n      ")])})}}])}):e._e()],2)},[],!1,null,"5215e21c",null);s.options.__file="index.vue";t.a=s.exports},"9ett":function(e,t,a){"use strict";a.r(t);var i=a("FyfS"),n=a.n(i),s=a("P2sY"),l=a.n(s),r=a("9Pcu"),o=a("+HKF"),c=a("t3Un");function u(e){return Object(c.a)({url:"/imageShare",method:"get",params:e})}function d(e){return Object(c.a)({url:"/imageShare",method:"post",data:e})}function m(e){return Object(c.a)({url:"/imageShare",method:"put",data:e})}function g(e){return Object(c.a)({url:"/imageShare/"+e.id,method:"delete"})}var p=a("QbLZ"),f=a.n(p),h=a("jo6Y"),v=a.n(h);function y(e){var t=e.gameId,a=v()(e,["gameId"]);return Object(c.a)({url:"/gameShare/"+t,method:"get",params:f()({},a)})}function b(e){return Object(c.a)({url:"/gameShare",method:"post",data:e})}function x(e){return Object(c.a)({url:"/gameShare",method:"put",data:e})}function _(e){return Object(c.a)({url:"/gameShare/"+e.id,method:"delete"})}var k={components:{Table:r.a,Dropzone:o.a},data:function(){return{name:"",list:[],listLoading:!1,saveLoading:!1,total:0,thead:[],listQuery:{gameId:"",index:1,pageSize:10,orderType:1,keyword:""},temp:{gameId:"",title:"",des:"",wxImage:"",commentImage:"",miniImage:""},dialogStatus:"",dialogFormVisible:!1,rules:{title:[{type:"string",required:!0,message:"标题是必须的",trigger:"blur"}],des:[{type:"string",required:!0,message:"描述是必须的",trigger:"blur"}]},actions:[{type:"primary",value:"编辑",click:this.handleUpdate},{type:"danger",value:"删除",click:this.handleDelete}]}},created:function(){var e=this.$route.query,t=e.id,a=e.name;this.listQuery.gameId=this.temp.gameId=parseInt(t),this.name=a,this.fetchData()},methods:{goBack:function(){this.$router.go(-1)},fetchData:function(){var e=this;this.listLoading=!0,(-1===this.listQuery.gameId?u:y)(this.listQuery).then(function(t){console.log(t);var a=t.data,i=a.totalCount,n=a.items||[];n.forEach(function(e){!e.miniImage&&(e.miniImage="")}),console.log(n),e.getHead(n),e.list=n,e.total=parseInt(i),e.listLoading=!1})},getHead:function(e){var t=[];for(var a in e[0]){var i={sort:!1};switch(a){case"id":i.label="id",i.value=a,i.sort=!0,i.width="60",t[0]=i;break;case"title":i.label="标题",i.value=a,t[1]=i;break;case"des":i.label="描述",i.value=a,t[2]=i;break;case"wxImage":i.label="微信分享图",i.value=a,i.isImage=!0,i.styleObject={width:"100px",height:"100px"},t[3]=i;break;case"commentImage":i.label="朋友圈分享图",i.value=a,i.isImage=!0,i.styleObject={width:"100px",height:"100px"},t[4]=i;break;case"miniImage":i.label="小程序分享图",i.value=a,i.isImage=!0,i.styleObject={width:"100px",height:"80px"},t[5]=i;break;default:continue}}this.thead=t},handleCurrentChange:function(e){this.listQuery.index=e,this.fetchData()},handleFilter:function(){this.listQuery.index=1,this.fetchData()},handleCreate:function(){var e=this;this.resetTemp(),this.dialogStatus="添加",this.dialogFormVisible=!0,this.$nextTick(function(){e.$refs.dataForm.clearValidate()})},handleUpdate:function(e){var t=this;this.temp=l()({},e),this.dialogStatus="编辑",this.dialogFormVisible=!0,this.$nextTick(function(){t.$refs.dataForm.clearValidate()})},handleDelete:function(e){var t=this;console.log("要删除的id",e.id),(-1===this.listQuery.gameId?g:_)({id:e.id}).then(function(){var a=t.list.indexOf(e);t.list.splice(a,1),t.total-=1,t.$notify({title:"成功",message:"用户删除成功",type:"success",duration:1500})})},resetTemp:function(){this.temp={gameId:this.listQuery.gameId,title:"",des:"",wxImage:"",commentImage:""}},checkout:function(){var e=this.temp,t=e.wxImage,a=e.commentImage,i=e.miniImage;return console.log(i),""!==t&&""!==a&&""!==i||(this.$message({message:"请上传图片",type:"error",duration:1500}),!1)},createData:function(){var e=this;this.saveLoading||this.$refs.dataForm.validate(function(t){if(t&&e.checkout()){e.saveLoading=!0;var a=l()({},e.temp);console.log("createData",a),(-1===e.listQuery.gameId?d:b)(a).then(function(t){var a=t.data;e.list.unshift(a),1===e.list.length&&e.getHead(e.list),e.total+=1,e.dialogFormVisible=!1,e.$notify({title:"成功",message:"创建成功",type:"success",duration:1e3,onClose:function(){e.saveLoading=!1}})}).catch(function(){e.$notify({title:"失败哦",message:"创建失败，请重试",type:"error",duration:1e3,onClose:function(){e.saveLoading=!1}})})}})},updateData:function(){var e=this;this.saveLoading||this.$refs.dataForm.validate(function(t){if(t&&e.checkout()){e.saveLoading=!0;var a=l()({},e.temp);console.log("updateData",a),(-1===e.listQuery.gameId?m:x)(a).then(function(t){var a=t.data,i=!0,s=!1,l=void 0;try{for(var r,o=n()(e.list);!(i=(r=o.next()).done);i=!0){var c=r.value;if(c.id===a.id){var u=e.list.indexOf(c);e.list.splice(u,1,a);break}}}catch(e){s=!0,l=e}finally{try{!i&&o.return&&o.return()}finally{if(s)throw l}}e.dialogFormVisible=!1,e.$notify({title:"成功",message:"更新成功",type:"success",duration:1e3,onClose:function(){e.saveLoading=!1}})}).catch(function(t){console.log(t),e.$notify({title:"失败",message:"更新失败，请重试",type:"error",duration:1e3,onClose:function(){e.saveLoading=!1}})})}})}}},w=(a("jrP9"),a("KHd+")),I=Object(w.a)(k,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"inner"},[a("span",{staticClass:"title"},[e._v(e._s(e.name)+"文案配置")]),e._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{type:"primary",size:"mini"},on:{click:e.goBack}},[e._v("返回")]),e._v(" "),a("div",{staticClass:"app-container"},[a("el-input",{staticClass:"filter-item",staticStyle:{width:"400px","margin-right":"20px"},attrs:{placeholder:"请输入要搜索的uid"},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.handleFilter(t):null}},model:{value:e.listQuery.keyword,callback:function(t){e.$set(e.listQuery,"keyword",e._n(t))},expression:"listQuery.keyword"}}),e._v(" "),a("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.handleFilter}},[e._v("搜索")]),e._v(" "),a("el-button",{staticClass:"filter-item",attrs:{type:"success",icon:"el-icon-edit"},on:{click:e.handleCreate}},[e._v("添加文案")]),e._v(" "),a("Table",{attrs:{thead:e.thead,list:e.list||[],listLoading:e.listLoading,actions:e.actions}}),e._v(" "),a("div",{staticClass:"pagination-container"},[a("el-pagination",{attrs:{background:"",layout:"prev, pager, next, jumper",total:e.total,"current-page":e.listQuery.index,"page-size":e.listQuery.pageSize},on:{"current-change":e.handleCurrentChange}})],1),e._v(" "),a("el-dialog",{attrs:{title:e.dialogStatus,visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("div",{staticClass:"dialog"},[a("el-form",{ref:"dataForm",staticStyle:{"min-width":"450px","max-width":"1000px"},attrs:{rules:e.rules,model:e.temp,"label-position":"right","label-width":"110px"}},[a("div",{staticClass:"form-left"},[a("el-form-item",{staticClass:"nickname",attrs:{label:"标题",prop:"title"}},[a("el-input",{model:{value:e.temp.title,callback:function(t){e.$set(e.temp,"title","string"==typeof t?t.trim():t)},expression:"temp.title"}})],1),e._v(" "),a("el-form-item",{staticClass:"des",attrs:{label:"描述",prop:"des"}},[a("el-input",{attrs:{autosize:{minRows:2,maxRows:4},type:"textarea",placeholder:"请输入详情"},model:{value:e.temp.des,callback:function(t){e.$set(e.temp,"des","string"==typeof t?t.trim():t)},expression:"temp.des"}})],1),e._v(" "),a("el-form-item",{staticClass:"wxImage",attrs:{label:"微信分享图(300*300px)"}},[a("Dropzone",{attrs:{number:0,imgWidth:150,imgHeight:150,imgSize:"300*300"},model:{value:e.temp.wxImage,callback:function(t){e.$set(e.temp,"wxImage",t)},expression:"temp.wxImage"}})],1),e._v(" "),a("el-form-item",{staticClass:"commentImage",attrs:{label:"朋友圈分享图(尺寸不限)"}},[a("Dropzone",{attrs:{number:1,imgWidth:150,imgHeight:150},model:{value:e.temp.commentImage,callback:function(t){e.$set(e.temp,"commentImage",t)},expression:"temp.commentImage"}})],1),e._v(" "),a("el-form-item",{staticClass:"miniImage",attrs:{label:"小程序分享图(400*320px)"}},[a("Dropzone",{attrs:{number:2,imgWidth:200,imgHeight:160,imgSize:"400*320"},model:{value:e.temp.miniImage,callback:function(t){e.$set(e.temp,"miniImage",t)},expression:"temp.miniImage"}})],1)],1)]),e._v(" "),a("div",{staticClass:"dialog-footer clearfix",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{staticStyle:{float:"left"},attrs:{type:"primary"},on:{click:function(t){e.dialogFormVisible=!e.dialogFormVisible}}},[e._v("取消")]),e._v(" "),a("el-button",{staticStyle:{float:"right"},attrs:{type:"success"},on:{click:function(t){"添加"===e.dialogStatus?e.createData():e.updateData()}}},[e._v("保存")])],1)],1)])],1)],1)},[],!1,null,"15f3426e",null);I.options.__file="shareConfig.vue";t.default=I.exports},Cejj:function(e,t,a){},FyfS:function(e,t,a){e.exports={default:a("Rp86"),__esModule:!0}},"RU/L":function(e,t,a){a("Rqdy");var i=a("WEpk").Object;e.exports=function(e,t,a){return i.defineProperty(e,t,a)}},Rp86:function(e,t,a){a("bBy9"),a("FlQf"),e.exports=a("fXsU")},Rqdy:function(e,t,a){var i=a("Y7ZC");i(i.S+i.F*!a("jmDH"),"Object",{defineProperty:a("2faE").f})},SEkw:function(e,t,a){e.exports={default:a("RU/L"),__esModule:!0}},SG8p:function(e,t,a){"use strict";var i=a("TqJv");a.n(i).a},TqJv:function(e,t,a){},YEIV:function(e,t,a){"use strict";t.__esModule=!0;var i=function(e){return e&&e.__esModule?e:{default:e}}(a("SEkw"));t.default=function(e,t,a){return t in e?(0,i.default)(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}},fXsU:function(e,t,a){var i=a("5K7Z"),n=a("fNZA");e.exports=a("WEpk").getIterator=function(e){var t=n(e);if("function"!=typeof t)throw TypeError(e+" is not iterable!");return i(t.call(e))}},jo6Y:function(e,t,a){"use strict";t.__esModule=!0,t.default=function(e,t){var a={};for(var i in e)t.indexOf(i)>=0||Object.prototype.hasOwnProperty.call(e,i)&&(a[i]=e[i]);return a}},jrP9:function(e,t,a){"use strict";var i=a("Cejj");a.n(i).a},ki4V:function(e,t,a){"use strict";var i=a("96ms");a.n(i).a}}]);