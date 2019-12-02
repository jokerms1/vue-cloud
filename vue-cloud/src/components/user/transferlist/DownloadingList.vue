<template>
  <div>
    <div v-for="(item,index) in list" class="fileitem">
      <FileItem :path_src="item.path_src" :percent="item.count/item.maxcount*100" :index="index" :method="method"></FileItem>
    </div>
  </div>
</template>
<script>
  import FileItem from "./fileitem/FileItem";
  export default {
      name:'DownloadingList',
      data(){
          return{
              list:[
                  {count:100,maxcount:3056,path_des:"10001/test/siip",path_src:"c:/fakepath/ssr-android.rar",ctime:new Date()},
                  {count:10,maxcount:20,path_des:"10001/test/wew",path_src:"c:/fakepath/1.txt",ctime:new Date()},
              ],
              percent:10,
              method:"download"
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
          getDownload(){
              this.axios.get('/getdownload',{

              }).then((res)=>{
                  this.list = res.data();
              }).catch((err)=>{
                  console.log(err);
              })
          }
      },
      mounted() {
          //this.getDownload();
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
