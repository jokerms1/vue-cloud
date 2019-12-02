<template>
      <div>
        <img class="img0" src="../../../../images/txt.png">
        <font class="font1">{{path_src}}</font>
<!--        文件上传时间或者是文件下载时间-->
  <!--      <font id="font2">{{item.ctime | dateFormat(item.ctime)}}</font>-->
        <div id="progress">
          <Progress :percent="parseFloat((this.cur_count / this.maxcount * 100).toFixed(2))"/>
        </div>
        <img class="img1" src="../../../../images/zanting.png" @click="iconChange(index)">
        <img class="img2" src="../../../../images/delete2.png">
        <img class="img3" src="../../../../images/wendang.png">
      </div>
</template>
<script>
    import SparkMD5 from 'spark-md5'
    export default {
        name:'FileItem',
        props:['path_src','type','file','index','method','url','count','maxcount'],
        data(){
            return{
                path:null,
                lock:true,
                spark:null,
                socket:null,
                tmp_md5:null,
                istimeout:false,
                intervalId:null,
                chunk_size:4096,
                cur_count:this.count,
                URL:"ws://192.168.0.48:8080/"
            }
        },
        methods:{
            //变更开始或者暂停的图片
            iconChange(index){
                //判断按钮是否暂停
                if(this.istimeout == false ){
                    $('.img1').eq(index).attr('src',require(`../../../../images/kaishi.png`))
                    //暂停
                    this.stop();
                    //判断方式，是上传还是下载
                    // if("upload" === this.method){
                    //     //调用上传的方式
                    //     this.upload();
                    // }else{
                    //     //调用下载的方式
                    //     this.download();
                    // }
                }else{
                    $('.img1').eq(index).attr('src',require(`../../../../images/zanting.png`));
                    //开始操作
                    this.start();
                }
                this.istimeout = !this.istimeout
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
                //判断方式，是上传还是下载
                if("upload" == this.method){
                    //上传
                    this.send(this.file,this.cur_count);
                }else{
                    //下载
                    this.download();
                }
            },
            //初始化socket
            initSocket(){
                if("underfined" == typeof(WebSocket)){
                    alert("您的浏览器不支持socket");
                }else{
                    //实例化socket
                    this.socket = new WebSocket(this.url);
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
                if(10017 == json.status) {
                    this.$Message.error("系统异常");
                    //this.$emit("pop",this.path_src);
                    return;
                }else if(20006 == json.status){
                    this.cur_count += 1;
                    console.log("传输完毕:" + json.status);
                    this.$emit('loadFileLists','ok');
                    this.close();
                }else if(20001 == json.status || this.max_count == json.count) {
                    //文件上传成功
                    this.cur_count += 1
                    console.log("文件上传成功");
                    this.$emit('loadFileLists','ok');
                    this.close();

                } else {
                    this.cur_count = json.count;
                    if(this.intervalId == null){
                        //判断方式，是上传还是下载
                        if("upload" == this.method){
                            //发送文件
                            this.send(this.file,json.count)
                        }else{
                            //下载文件
                            this.download(this.file,json.count);
                        }
                    }
                    //console.log("我是先执行的");
                }
            },
            //向websocketServer发送数据
            send(file,count){
                if( null != this.intervalId){
                    return;
                }
                this.intervalId = setInterval(()=>{
                    //文件发送的状态
                    console.log('发送');
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
                        this.$emit('loadFileLists','ok');
                        this.close();
                        console.log("发送文件完毕");
                    }
                    //关闭定时器
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                },50);
            },
            //用于实现下载文件
            download(){

            },
            //关闭socket的连接
            close(){
                this.socket.close()
                console.log('socket已经关闭');
            }
        },
        mounted(){
          this.initSocket();
        },
        distroyed(){
            this.socket.onclose()
            this.socket = null
        }
    }
</script>
<style scoped>
  #progress{
    width: 200px;
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
    text-overflow: ellipsis;
    -moz-text-overflow:ellipsis;
    text-align: left;
    white-space: nowrap;
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
