<template>
  <div>
    <img class="img0" src="../../../../images/txt.png">
    <font class="font1">{{path_src}}</font>
    <!--        文件上传时间或者是文件下载时间-->
    <!--      <font id="font2">{{item.ctime | dateFormat(item.ctime)}}</font>-->
    <div id="progress">
      <Progress :percent="percent"/>
    </div>
    <img class="img1" src="../../../../images/kaishi.png" @click="iconChange(index)">
    <img class="img2" src="../../../../images/delete2.png">
    <img class="img3" src="../../../../images/wendang.png">
  </div>
</template>
<script>
  export default {
      name:'FileTranferCompleteItem'
  }
</script>
<style>
  #progress{
    width: 300px;
    position: absolute;
    right:200px;
    top: 30%;
  }
  /*文件列表的展示*/
  .img0{
    width: 25px;
    height: 25px;
    position: absolute;
    left:10px;
    top: 50%;
    transform: translate(0,-50%);
  }
  .font1{
    position: absolute;
    left: 50px;
    top: 50%;
    transform: translate(0,-50%);
  }
  #font2{
    position: absolute;
    left: 300px;
    top: 50%;
    transform: translate(0,-50%);
  }

  .img1{
    width: 15px;
    height: 15px;
    position: absolute;
    right: 150px;
    top: 50%;
    transform: translate(0,-50%);
  }
  .img2{
    width: 13px;
    height: 13px;
    position: absolute;
    right: 100px;
    top: 50%;
    transform: translate(0,-50%);
  }
  .img3{
    width: 15px;
    height: 15px;
    position: absolute;
    right: 50px;
    top: 50%;
    transform: translate(0,-50%);
  }
</style>
