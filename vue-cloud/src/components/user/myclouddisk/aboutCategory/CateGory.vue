<template>
  <div>
    <div style="padding: 10px; border: #e9fff8;background: #f5faec;min-width: 1000px" >
      <Button @click="chooseFile" id="uploadBtn"><Icon type="md-cloud-upload"></Icon>上传</Button>
      <input type="file" id="uploadfile" name="file" style="display: none" @change="getFile">
      <Button><Icon type="md-cloud-download"></Icon>下载</Button>
      <Button><Icon type="md-share"></Icon>分享</Button>
      <Button><Icon type="ios-trash"></Icon>删除</Button>
      <!--    <input  id="uploadfile" type="file" value="上传" @change="getFile">-->
    </div>
    <div style="padding: 10px;border-bottom: 1px solid rgba(149,149,149,0.23);min-width: 1000px">
      <Breadcrumb>
        <BreadcrumbItem to="/">{{this.type}}</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <el-table
      v-loading="previewLoading"
      ref="fileSelection"
      :data="fileList"
      tooltip-effect="dark"
      style="width: 100%;min-width: 1000px"
      size="mini"
      highlight-current-row
      @selection-change="handleFileSelect"
      @cell-mouse-enter="handleMouseEnter"
      @cell-mouse-leave="handleMouseLeave"
      @current-change="handleCurrentClick"
      @cell-dblclick="enterOrPreview(clickFile, fileSelection[0].type, fileSelection[0].fileName)"
      :default-sort = "{prop: 'time', order: 'descending'}">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="fileName"
        label="文件名"
        sortable>
        <template slot-scope="scope">
          <el-row class="file_and_tools"  v-bind:hoverFilePath=scope.row.path>
            <el-col :span="18" class="icon_and_name">
              <img class="table_file_icon"
                   :src="require('../../../../images/'+scope.row.type+'.png')">
              <p class="table_file_name" v-show="!(clickFile === scope.row.path && showRenameDiv)"
                 @click="enterOrPreview(scope.row.path, scope.row.type, scope.row.fileName)">{{ scope.row.fileName }}</p>
              <div class="rename_file" v-show="clickFile === scope.row.path && showRenameDiv">
                <input v-model="renameFileName">
                <el-button size="mini"  icon="el-icon-check" circle @click="renameFile(clickFile,renameFileName)"> </el-button>
                <el-button size="mini"  icon="el-icon-close" circle @click="cancelRename"> </el-button>
              </div>
            </el-col>
            <el-col :span="5" class="file_operate" v-show="hoverFilePath === scope.row.path">
              <a @click="showDecompressDialog = true" v-show="scope.row.type === 'zip'"><i class="el-icon-news"></i></a>
              <a @click="showShareDialog = true"><i class="el-icon-share"></i></a>

              <!--              <a @click="downloadFile(scope.row.path, scope.row.type)"><i class="el-icon-download"></i></a>-->
              <a  @click="downloadFile(scope.row.path,scope.row.type)"   id="down1" ><i class="el-icon-download"></i></a>

              <!--<a v-if="scope.row.isDir==='文件夹' " v-bind:href="GLOBAL.BASE_URL+'/downloadFolder?srcName=/user'+ scope.row.path"><i class="el-icon-download"></i></a>
              <a v-else-if="scope.row.isDir==='文件'" v-bind:href="GLOBAL.BASE_URL+'/downloadFolder?srcName=/user'+ scope.row.path"><i class="el-icon-download"></i></a>-->

              <el-dropdown trigger="click"  @command="handleMoreComment">
                  <span class="el-dropdown-link">
                    <a><i class="el-icon-more-outline"></i></a>
                  </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="move">移动到</el-dropdown-item>
                  <el-dropdown-item command="copy">复制到</el-dropdown-item>
                  <el-dropdown-item command="rename">重命名</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        prop="size"
        label="大小"
        width="120"
        sortable
        sort-by="len">
      </el-table-column>
      <el-table-column
        prop="time"
        label="修改日期"
        width="180"
        sortable>
      </el-table-column>
    </el-table>

    <el-card class="box-card" :body-style="{padding: '0px'}">
      <div slot="header" class="clearfix">
        <span>上传完成</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="hideCard">
          <img src="../../../../images/delete2.png" style="height: 15px;width: 15px">
        </el-button>
        <el-button  style="float: right; padding: 3px 10px" type="text" @click="BigOrSmall">
          <img id="bigorsmall" src="../../../../images/suoxiao.png" style="height: 15px;width: 15px">
        </el-button>
      </div>
      <div  class="body">
        <div v-for="(item,index) in uploadlist" class="fileitem">
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
            :method="item.method">
          </FileItem>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import FileItem from "../../transferlist/fileitem/FileItem";
  export default {
      name:"CateGory",
      data(){
          return{
              URL:"ws://192.168.0.24:8080/upload?",
              tmp_md5:null,
              size:null,
              type:null,
              spark:null,
              path:null,
              socket:null,
              chunk_size:1024,
              file:null,
              cur_count:0,
              fileList:[],
              max_count:null,
              lock:true,
              fileList:[],
              containerList:[],
              suffixList:[],      //类型相关的后缀列表
              clickflag:true,     //判断点击的flag
              uploadlist: [],      //上传文件的列表
              downloadlist:[],     //下载文件的列表
              renameFileName:'',   //重命名编辑中的文件名
              breadList:[{path:'/', name:'全部文件'}],
              showBackToPre:false,
              hoverFilePath:'',       //鼠标进入时的文件路径
              clickFile:'',           //单个选中的文件
              clickFiles:[],          //多个选中的文件
              fileSelection: [],      //文件列表中选中的文件
              showDeleteFileDialog:false, //确认删文件的对话框
              showRenameDiv:false,      //重命名的区域的显现
              renameFileName:'',        //重命名编辑中的文件名
              isRename:true,
              showPDF:false ,
              moveOrCopy:'',
              showVideoPlay:false,
              showAudioPlay:false,
              showUploadAside:false,
              showShareDialog: false,
              showDecompressDialog:false,
              previewLoading:false,
          }
      },
      methods:{
          //初始化文件列表
          initPageType(){
            this.type = this.$route.query.type;
            //根据类型获取相关后缀列表
            if(this.type === "text"){
                this.suffixList = [".txt",".doc",".hlp",".wps",".rtf",".html",".pdf",".ader"];
            }else if(this.type === "image"){
                this.suffixList = [".bmp",".gif",".jpg",".pic",".png"];
            }else if(this.type === "video"){
                this.suffixList = ["avi","mpg","mov","swf"];
            }else if(this.type === "music"){
                this.suffixList = ["wav","aif","au","mp3","ram","player","wma","mmf","amr","aac","flac"];
            }else if(this.type === "other"){
                this.suffixList = ["int","sys","dll","adt","exe","com","c","asm","for","lib","lst","msg","obj","pas",
                    "wki","bas","tmp","dot","bat","cmd"];
            }
            this.initContainerList();
          },

          //关闭传输页面
          hideCard(){
              $(".box-card").hide();
          },
          //用于放大或者缩小传输列表页面
          BigOrSmall(){
              if( true == this.clickflag){
                  $(".body").slideUp();
                  $("#bigorsmall").attr("src",require("../../../../images/fangda.png"))
              }else{
                  $(".body").slideDown();
                  $("#bigorsmall").attr("src",require("../../../../images/suoxiao.png"))
              }
              this.clickflag = !this.clickflag;
          },
          initContainerList(){
              this.axios.get('/getcontainers').then((res)=>{
                  console.log(res);
                  //赋值到containerlist
                  this.containerList = res.data;
                  this.loadFileListByType();
              }).catch((err)=>{
                  console.log(err);
              })
          },
          //加载文件列表通过文件类型
          loadFileListByType(){
              let filelist = new Array();
              //获取所有容器中跟这类型相关的文件
              this.containerList.forEach((item)=>{
                  console.log("container1231234:");
                  console.log(item.container);
                  var test = new FormData();
                  test.append('container', item.container)
                  test.append('suffixs', this.suffixList)
                  this.axios.post('findbysuffix',test).then((res)=>{
                      console.log(res.data);
                      //{fileName:'新建文件夹'+this.newdir,size:'0',path:this.breadList[this.breadList.length-1].path,isDir:'文件夹',time:time,type:'folder'}
                      for(let i = 0 ; i <= res.data.length - 1; i++) {
                          var files = res.data[i].path.split('/');
                          var filename = files[files.length - 1];
                          if (res.data[i].isdir == true) {
                              let type = 'folder'
                              filelist.push({
                                  fileName: filename,
                                  size: res.data[i].size,
                                  path: res.data[i].path,
                                  time: res.data[i].lastModified,
                                  isDir: '文件',
                                  type: type
                              });
                          } else {
                              let type = filename.split('.')[1];
                              //判断文件类型，如果没有匹配的就默认是不识别的图片
                              if (!(type == 'html' || type === 'doc' || type === 'ppt' || type === 'pptx' || type === 'zip' ||
                                  type === 'txt' || type === 'code' || type === 'xls' || type === 'pdf' || type === 'img' ||
                                  type === 'docx' || type === 'exe' || type === 'jpg' || type === 'png')) {
                                  type = 'undefined'
                              }
                              filelist.push({
                                  fileName: filename,
                                  size: res.data[i].size,
                                  path: res.data[i].path,
                                  time: res.data[i].lastModified,
                                  isDir: '文件',
                                  type: type
                              });
                          }
                      }
                  }).catch((err)=>{
                      console.log(err);
                  })
              });
              this.fileList = filelist
          },
          /*创建n位的随机数*/
          randomNum(n){
              let rnd="";
              for(let i=0;i<n;i++)
                  rnd+=Math.floor(Math.random()*10);
              return rnd;
          },
          //新建文件夹
          newFolderPushToFileList(){
              // this.newdir++;
              let d = new Date();
              var time=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
              this.renameFileName = '新建文件夹'+this.newdir;
              this.fileList.unshift({fileName:'新建文件夹'+this.newdir,size:'0',path:this.breadList[this.breadList.length-1].path,isDir:'文件夹',time:time,type:'folder'});
              let filename = this.randomNum(4);
              this.fileList[0].path+=filename;
              this.$refs.fileSelection.clearSelection();
              //this.$refs.fileSelection.toggleRowSelection(this.fileList[0]);
              this.$refs.fileSelection.setCurrentRow(this.fileList[0]);
              this.showRenameDiv = true;
              //this.clickFile = this.fileList[0].path;
              this.isRename = false;
          },
          createNewFolder(newFilename){
              let pPath = this.breadList[this.breadList.length-1].absolutepath+'/'+newFilename;
              this.axios.get('createdir',{
                  params:{
                      container:this.$cookies.get('container'),
                      path:pPath
                  }
              }).then((res)=>{
                  console.log(res.data);
                  if(res.data.status == "10000"){
                      //this.$Message.success("1111创建文件夹成功");
                      this.showRenameDiv = false;
                      this.isRename = true;
                      this.loadFileList();
                      // window.location.reload();
                  }
              }).catch((err)=>{
                  this.$Message.error("222创建文件夹失败");
                  console.log(err);
              })
          },
          /*重命名文件*/
          renameFile(oldPath, newFileName) {
              this.fileList = null
              if(!this.isRename) {
                  this.createNewFolder(this.renameFileName);
                  return;
              }
              // this.$axios.post('/file/rename',{
              //     oldPath:oldPath,
              //     newName:newFileName,
              // })
              //     .then(function (res) {
              //         if(res.data.status === '文件已经存在！')
              //             this.drawMsg('error','文件名已存在！');
              //         else if(res.data.status === '修改成功') {
              //             this.drawMsg('success','文件名修改成功');
              //             this.showRenameDiv = false;
              //             this.loadFileList();
              //         }
              //     }.bind(this))
              //     .catch(function (err) {
              //         console.log(err)
              //     })
              // this.drawMsg('success','文件名修改成功');
              //this.showRenameDiv = false;
          },

          /*预览文件时在面包屑上加入新的目录*/
          addBreadList(path, name) {
              // console.log("385" + path);
              // console.log("385" + name);
              let absolutepath;
              //判断是否是根目录
              if(this.breadList.length == 1){
                  absolutepath = this.breadList[this.breadList.length-1].absolutepath  + path;
              }else {
                  absolutepath = this.breadList[this.breadList.length - 1].absolutepath + '/' + path;
              }
              this.breadList.push({absolutepath:absolutepath,path:path, name:name});
              this.loadDir(path);
          },
          /*文件选择触发的事件*/
          handleFileSelect(val){
              this.fileSelection = val;
              //console.log(this.fileSelection)
          },
          /*单击选择单元格事件*/
          handleCurrentClick(val) {
              if(val === null)
                  return;
              this.clickFile = val.path;
              this.$refs.fileSelection.clearSelection();
              this.$refs.fileSelection.toggleRowSelection(this.fileList[this.fileList.indexOf(val)]);
              this.showRenameDiv = false;
              this.renameFileName = val.fileName;
          },
          /*鼠标进入或离开文件单元格时触发的事件*/
          handleMouseEnter(event){
              this.hoverFilePath = event.path;
          },
          handleMouseLeave(){
              this.hoverFilePath = '';
          },
          /*更多的文件操作*/
          handleMoreComment(command){
              if(command === 'rename')
                  this.showRenameDiv = true;
              else if(command === 'delete')
                  this.showDeleteFileDialog = true;
              else if(command === 'move'){
                  this.showTreeDialog = true;
                  this.moveOrCopy = 'move';
              }
              else if(command === 'copy'){
                  this.showTreeDialog = true;
                  this.moveOrCopy = 'copy';
              }
          },
          //删除文件
          deleteFiles(){
              console.log(this.fileSelection);
              let absolutepath   //文件的绝对路径
              let deletemethod   //文件删除的方式,是删除文件夹,还是删除文件
              //判断是否是根目录下
              if(this.breadList.length == 1){
                  absolutepath = this.fileSelection[0].fileName;
              }else{
                  absolutepath = this.breadList[this.breadList.length-1].absolutepath + '/' + this.fileSelection[0].fileName;
              }
              //判断文件是否是文件夹，如果是文件夹，就调用删除文件夹的请求，如果不是文件夹，就调用删除文件的请求
              if(this.fileSelection[0].type == 'folder'){
                  deletemethod = 'deletedir'
              }else{
                  deletemethod = 'deletefile'
              }
              this.axios.get(deletemethod,{
                  params:{
                      container:this.$cookies.get('container'),
                      path:absolutepath
                  }
              }).then((res)=>{
                  console.log(res);
                  if(res.data.status == "10000"){
                      //$Message.success("删除文件成功");

                  }
                  this.loadFileList();
                  this.showDeleteFileDialog = false;
              }).catch((err)=>{
                  console.log(err);
                  this.showDeleteFileDialog = false;
              })
          },
          //取消重命名
          cancelRename() {
              this.showRenameDiv=false;
              if(!this.isRename) {
                  this.isRename = true;
                  this.fileList.shift();
                  this.handleCurrentClick(null);
              }
          },
          /*预览文件、文件夹*/
          enterOrPreview(path, type, name){
              // console.log("path:" + path);
              // console.log("name" + name);
              if(type == 'folder'){
                  //this.fileList = null
                  this.addBreadList(path, name);
              }
              else if(type === 'doc' || type === 'ppt' || type === 'txt' || type === 'code' ||  type === 'xls' || type === 'pdf' || type === 'img' || type === 'docx' || type === 'c'){
                  this.previewLoading = false;
                  this.pdfurl = this.GLOBAL.BASE_URL + "/preview/pdf?path=" + path;
                  this.showPDF = true;
              }
              else if(type === 'video') {
                  this.showVideoPlay = true;
              }
              else if(type === 'music') {
                  this.showAudioPlay = true;
              }
          },
          //停止发送文件切片
          stop(){
              //停止计时器
              clearInterval(this.intervalId);
          },
          //开始或者继续发送文件切片
          start(){
              //停止计时器
              clearInterval(this.intervalId);
              this.intervalId = null
              //调用发送函数
              this.send(this.file,this.cur_count);
          },
          //文件选择按钮点击事件
          chooseFile(){
              document.getElementById('uploadfile').click();
          },
          //上传文件
          uploadFile(file){
              if( null == this.size){
                  this.$Message.error('获取文件大小失败');
                  return;
              }else if(null == this.tmp_md5){
                  this.$Message.error('获取文件md5值失败')
                  return;
              }else if(null == this.path){
                  this.$Message.error('获取文件路径失败');
              }
              console.log("size:"+this.size+" "+ "md5:"+this.tmp_md5);
              //替换路径中的'\'为'/'
              var _path = this.path.replace(/\\/g,'/');
              //获取token的值
              var _token = this.$cookies.get('token');
              //添加参数
              this.URL +="path_src="+ _path + "&path_des=" + "wqdqwdwefwg" + "&container=" + "test"
                  +"&md5=" + this.tmp_md5 + "&size=" + this.size + "&count="+ this.cur_count
                  +"&maxcount=" + this.max_count +"&token="+_token;
              //初始化socket
              var path2 = _path.split('/');
              var des = path2[path2.length - 1];
              var list = {file:this.file,path_src:_path,path_des:des,container:"test",md5:this.tmp_md5,size:this.size,count:this.cur_count,maxcount:this.max_count,token:_token,method:"upload"}
              // this.$store.state.uploadlist.push(list);
              this.uploadlist.push(list);
              //this.initSocket();
          },
          //获取文件
          getFile(){
              //获取到文件
              this.file =document.getElementById("uploadfile").files[0];
              if( null != this.file){
                  this.path = $('#uploadfile').val();
                  console.log(this.path);
                  //获取到文件的大小
                  this.size = this.file.size;
                  console.log(this.size)
                  //获取文件的md5码
                  this.get_filemd5sum(this.file);
              }
          },
          //获取文件的md5码
          get_filemd5sum(file){
              var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlize;
              //切片的大小
              var chunk_size = 1024;
              //切片的数量
              var chunks = Math.ceil(file.size / chunk_size);
              this.max_count = chunks;
              //当前的切片数
              var currentChunk = 0;
              //切片的md5码的数组
              this.spark = new SparkMD5.ArrayBuffer();
              var fileReader = new FileReader()
              fileReader.onload = (e)=> {
                  this.spark.append(e.target.result);
                  currentChunk++;
                  var md5_porgress = Math.floor((currentChunk)/chunks*100);
                  console.log(file.name + " 正在处理，请稍等,"+"已完成"+ md5_porgress+'%');
                  if(currentChunk < chunks){
                      loadNext();
                  }else{
                      this.tmp_md5 = this.spark.end();
                      console.log(this.tmp_md5);
                      if(null != this.tmp_md5){
                          this.uploadFile(file)
                      }
                  }
              };
              //文件读取失败
              fileReader.onerror = ()=>{
                  this.$Message.error('文件读取出错');
                  //关闭socket的连接
                  this.close();
              };
              function loadNext() {
                  var start = currentChunk * (chunk_size);
                  var end = ((start+ (chunk_size)) >= file.size) ? file.size : start + (chunk_size);
                  fileReader.readAsArrayBuffer(blobSlice.call(file,start,end));
              }
              loadNext()
          },
          //下载文件
          downloadFile(){

          },
          //初始化socket
          initSocket(){
              if("underfined" == typeof(WebSocket)){
                  alert("您的浏览器不支持socket");
              }else{
                  //实例化socket
                  console.log(this.URL);
                  this.socket = new WebSocket(this.URL);
                  //监听socket链接
                  this.socket.onopen = this.open;
                  //监听socket错误信息
                  this.socket.onerror = this.error;
                  //监听socket信息
                  this.socket.onmessage = this.getMessage;
              }
          },
          //监听是否连接成功
          open(){
              console.log('socket连接成功');
          },
          //监听是否连接失败
          error(){
              console.log("连接失败");
          },
          //获取websocketServer中发出的信息
          getMessage(msg){
              console.log(msg.data);
              var json = JSON.parse(msg.data)
              console.log(json.status);
              // var msg = JSON.parse(_msg);
              if(20001 == json.status || this.max_count == json.count) {
                  //文件上传成功
                  alert("文件上传成功");
                  this.close();
              } else {
                  this.cur_count = json.count;
                  if(this.intervalId == null){
                      this.send(this.file,json.count)
                  }
                  //console.log("我是先执行的");
              }
          },
          //向websocketServer发送数据
          send(file,count){
              if(!this.socket || this.socket.readyState != 1){
                  console.log("restartscoket")
                  this.initSocket();
              }
              if( null != this.intervalId){
                  return;
              }
              this.intervalId = setInterval(()=>{
                  // 文件发送的状态
                  var status = false;
                  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlize;
                  var startSize = count * this.chunk_size;
                  var endSize;
                  var md5 = new SparkMD5.ArrayBuffer();
                  if(startSize < file.size){
                      //判断是否是最后的一个切片
                      if((startSize + this.chunk_size) < file.size){
                          endSize = startSize + this.chunk_size;
                      }else{
                          status = true;
                          endSize = file.size;
                      }
                      //读取文件
                      var reader = new FileReader();
                      reader.readAsArrayBuffer(blobSlice.call(file,startSize,endSize));
                      //文件加载
                      reader.onload = (e)=> {
                          var ArrayBuffer = e.target.result;
                          console.log(ArrayBuffer);
                          //发送文件
                          this.socket.send(ArrayBuffer);
                      }
                  }else{
                      startSize = endSize = 0;
                      console.log("发送文件完毕");
                  }
                  // 关闭定时器
                  clearInterval(this.intervalId);
                  this.intervalId = null;
              },50);
          },
          //关闭socket的连接
          close(){
              this.socket.close()
              console.log('socket已经关闭');
          }
      },
      components:{
          FileItem
      },
      mounted(){
          $(".box-card").hide();
          this.initPageType();
      },
      watch:{
        '$route.query.type':function () {
            this.initPageType();
        }
      },
      distroyed(){
          this.socket.onclose()
          this.socket = null
      }
  }
</script>
<style>
  .menu{
    padding: 10px;
    border: #e9fff8;
    background: #f5faec;
    min-width: 1000px;
  }
  .fileitem{
    border-bottom: 1px solid rgba(149,149,149,0.23);
    display: flex;
    width: 100%;
    height: 50px;
    display: flex;
    position: relative;
  }

  .body{
    height: 300px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 700px;
    position: fixed;
    right: 50px;
    bottom: 0;
    z-index:3;
  }

  .all_operate {
    display: inline-flex;
    padding: 15px 20px;
    min-width: 850px;
  }
  .all_operate div{
    margin-left: 10px;
  }

  .search_and_sort {
    display: inline-flex;
    float: right;
    line-height: 64px;
    margin-right: 5px;
    height: 64px;
    min-width: 250px;
  }
  .search_icon:hover{
    color: #3b8cff;
  }
  .sort_icon{
    font-size: 20px;
    color: #0b074b;
    line-height: 60px;
    height: 60px;
    margin: 0 10px;
  }

  .all_operate .el-button {
    /*color: #3b8cff;*/
    height: 34px;
    padding: 8px 15px;
  }
  .btn_primary {
    color: #FFF;
  }
  .el-button span {
    margin-left: 6px;
  }

  .bread_and_count {
    padding-left: 20px ;
    padding-top: 15px;
    width: 100%;
  }
  .about_bread {
    display: inline-flex;
    font-size: 14px;
    height: 15px;
    line-height: 15px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
  .about_return_to_pre {
    display: inline-flex;
  }
  .return_to_pre {
    color: #409EFF;
  }
  .bread_line {
    color: #c3c3c3;
    margin:0 4px;
  }
  .bread_style{
    color: #409EFF;
    font-weight: 500;
    display: inline-block;
    max-width:200px;
    overflow:hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
  .file_count {
    float: right;
    color: #848484;
    margin-right: 10px;
    font-size: 14px;
    height: 15px;
    line-height: 14px;
    width: 150px;
  }

  .file_and_tools{
    display: inline-flex;
    width: 100%;
  }
  .icon_and_name {
    display: inline-flex;
    margin-top: -15px;
  }
  .table_file_icon{
    height: 32px;
    line-height: 32px;
  }
  .table_file_name {
    margin-left: 5px;
    font-size: 14px;
    line-height: 32px;
    cursor: pointer;
  }
  .file_operate{
    margin-top: -16px;
    display: inline-flex;
    float: right;
    line-height: 32px;
  }
  .file_operate a{
    font-size: 23px;
  }
  .file_operate i {
    margin-left: 8px;
    color: cornflowerblue;
  }

  .rename_file input{
    height: 32px;
    line-height: 32px;
    padding-left: 5px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    margin: 0 10px;
  }

  .video_audio {
    width: 100%;
    height: 450px;
    overflow: hidden;
  }
  .preview_music {
    width: 60%;
    margin-left: 20%;
    margin-top: 60px;
  }
  .music_name {
    margin-top: 5%;
    font-size: 18px;
    width: 100%;
    text-align: center;
  }
  .uploadBox{
    position: fixed;
    right: 30px;
    bottom: 0;
    width: 500px;
  }
</style>
