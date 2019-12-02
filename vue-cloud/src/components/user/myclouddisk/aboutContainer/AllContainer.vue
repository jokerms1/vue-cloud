<template>
  <div>
    <div style="padding: 10px; border: #e9fff8;background: #f5faec;min-width: 1000px" >
      <Button><Icon type="md-share"></Icon>分享</Button>
      <Button><Icon type="ios-trash"></Icon>删除</Button>
      <Button @click="dialogFormVisable = true"><Icon type="el-icon-cloudy"></Icon>新建云盘</Button>
<!--      <Button>申请中...</Button>-->
      <!--    <input  id="uploadfile" type="file" value="上传" @change="getFile">-->
    </div>
    <div style="padding: 10px;border-bottom: 1px solid rgba(149,149,149,0.23);min-width: 1000px">
      <Breadcrumb>
        <BreadcrumbItem to="/">全部云盘</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div style="padding: 20px;position: relative">
      <div v-for="(item,index) in containerList"  class="containerlist">
        <div class="containerImg">
          <img style="height: 40px;width:auto;" src="../../../../images/yingpan.png" @click="jump(index)">
        </div>
        <div class="containerInfo">
          <h4>{{item.container}}</h4>
          <el-progress :text-inside="true" :show-text="false" :stroke-width="15" :percentage="(item.used/item.max)*100"></el-progress>
          <p>已用{{bytesToSize(item.used)}}/{{bytesToSize(item.max)}}</p>
        </div>
      </div>
    </div>
    <el-dialog
      title="申请"
      :visible.sync="dialogFormVisable"
      width="400px"
    >
      <el-form>
        <el-form-item label="申请云盘:" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="申请大小:" :label-width="formLabelWidth">
          <el-input v-model="form.size" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisable = false">取 消</el-button>
        <el-button type="primary" @click="createContainer">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import router from "../../../../router";
  export default {
      name:"AllContainer",
      router,
      data(){
          return{
              containerList:[],
              dialogFormVisable:false,
              form: {
                  name: '',
                  size:''
              },
              formLabelWidth: '80px'
          }
      },
      methods:{
          //初始化容器
          initContainer(){
            this.axios.get('/getcontainers').then((res)=>{
                console.log(res);
                //赋值到containerlist
                this.containerList = res.data;
            }).catch((err)=>{
                console.log(res);
            })
          },
          //跳转到所有文件的页面
          jump(index){
              this.$router.push({
                     path:"/Home/MyCloudDisk/AllFile",
                     query:{
                         container:this.containerList[index]
                     }
                  }
              )
          },
          //创建容器
          createContainer(){
              //关闭弹窗
              this.dialogFormVisable = false
              //默认申请的空间为GB
              let size = this.form.size*Math.pow(1024,3);
              this.axios.get('createcontainer',{
                  params:{
                      container:this.form.name,
                      size:size
                  }
              }).then((res)=>{
                  // if( 10000 == res.data.status){
                  //     var container = {
                  //         container:this.form.name,
                  //         max:size,
                  //         used:0
                  //     }
                  //     this.containerList.push(container);
                  // }else{
                  //     this.$Message.err("创建容器失败");
                  // }
                  if("10000" === res.data.status){
                      this.$Message.success("已经发出申请请求,等待管理员处理");
                  }else{
                      this.$Message.error("申请请求失败");
                  }

              }).catch((err)=>{
                  console.log(err);
              })
          },
          //数据容量单位转换函数，比特
          bytesToSize(bytes) {
              if (bytes === 0) return '0.00 B';
              var k = 1024, // or 1000
                  sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                  i = Math.floor(Math.log(bytes) / Math.log(k));
              // console.log(i);
              return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
          }
      },
      mounted() {
          this.initContainer();
      }
  }
</script>
<style>
    h3{
      text-align: center;
    }
    li{
      list-style: none;
    }

    .containerlist{
      float: left;
      margin-left: 40px;
      height: 66px;
      width: 250px;
    }

    .containerImg{
      line-height: 66px;
      width: 64px;
      float: left;
      justify-content: center;
      align-items: center;
    }
    .containerInfo{
      width: 150px;
      float: left;
      margin-left: 10px;
    }
</style>
