<template>
  <div>
    <div v-for="(item,index) in $store.state.uploadlist" class="fileitem">
      <FileItem
        :file="item.file"
        :path_src="item.path_src"
        :path_des="item.path_des"
        :percent="item.count/item.maxcount*100"
        :token="item.token"
        :container="item.container"
        :count="item.count"
        :maxcount="item.maxcount"
        :md5="item.md5"
        :size="item.size"
        :index="index"
        :method="method"></FileItem>
    </div>
<!--    var list1 = {path_src:_path,path_des:"svp",container:"test",-->
<!--    md5:this.tmp_md5,size:this.size,count:this.cur_count,maxcount:this.maxcount,token:_token}-->
  </div>
</template>
<script>
  import FileItem from "./fileitem/FileItem";
  export default {
      name:'UploadingList',
      data(){
          return{
              percent:10,
              method:"upload"
          }
      },
      //过滤器
      filters:{
          dateFormat:function (date) {
              var dt = new Date(date)
              var y = dt.getFullYear()
              var m = dt.getMonth() + 1
              var d = dt.getDate()
              return 	`${y}-${m}-${d}`
          },
          imgFormat:function (data) {
              var imgUrl = "../../../images/";
              var type = data.splite('.')[1];
              return imgUrl+type+".png";
          }
      },
      methods:{
          // getUpload(){
          //     this.axios.get('/getupload',{
          //
          //     }).then((res)=>{
          //         console.log(res.data);
          //         this.list = res.data;
          //         // store.state.list = res.data;
          //     }).catch((err)=>{
          //         console.log(err);
          //     })
          // }
      },
      mounted() {
          //this.getUpload();
      },
      components:{
          FileItem
      }
  }
</script>
<style scoped>

  li{
    list-style: none;
    position: absolute;
    top:50%;
    bottom: auto;
  }
  .fileitem{
    border-bottom: 1px solid rgba(149,149,149,0.23);
    display: flex;
    width: 100%;
    height: 50px;
    display: flex;
    position: relative;
  }
  /*鼠标接触再文件列表的效果*/
  .fileitem:hover{
    background: rgba(76, 139, 150, 0.08);
  }

  /*文件显示的div*/
  .div-file-show{
    width: 100%;
    height: 50px;
    border-bottom: 1px solid rgba(149,149,149,0.23);
    display: flex;
    justify-content: space-between;
    /*position: relative;*/
  }
</style>
