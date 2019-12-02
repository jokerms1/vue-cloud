<template>
  <Layout id="cStore_body">
    <Sider hide-trigger :style="{background: '#ffffff'}" >
      <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
        <div class="file-group">
          <router-link to="/Home/MyCloudDisk/AllContainer" class="router-link-activer">
            <MenuItem name="1">
              <Icon type="md-document"></Icon>
              <span>所有云盘</span>
            </MenuItem>
          </router-link>
          <MenuItem name="2" >
            <p @click="jumpToTypePage('image')">图片</p>
          </MenuItem>
          <MenuItem name="3">
            <p @click="jumpToTypePage('video')">视频</p>
          </MenuItem>
          <MenuItem name="4">
            <p @click="jumpToTypePage('text')">文档</p>
          </MenuItem>
          <MenuItem name="5">
            <p @click="jumpToTypePage('music')">音乐</p>
          </MenuItem>
          <MenuItem name="6">
            <p @click="jumpToTypePage('seed')">种子</p>
          </MenuItem>
          <MenuItem name="7">
            <p @click="jumpToTypePage('other')">其他</p>
          </MenuItem>
          <MenuItem name="8">
            <Icon type="md-share"></Icon>
            <span>我的分享</span>
          </MenuItem>
          <MenuItem name="9">
            <Icon type="ios-trash"></Icon>
            <span>回收站</span>
          </MenuItem>
        </div>
      </Menu>
      <div style="width: 100%;height: 100%;border-right: 1px solid rgba(149,149,149,0.23);">

      </div>
    </Sider>
<!--    <Layout :style="{padding: '0 24px 24px'}">-->
    <Layout>

<!--      <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">-->
      <Content :style="{background:'#fff'}">
        <router-view></router-view>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
  // import AllFile from "./myclouddisk/aboutFile/AllFile";
  import router from "../../router";
  export default {
      name:'MyCloudDisk',
      router,
      data(){
        return{
            bodyHeight: document.documentElement.clientHeight-66,
        }
      },
      methods:{
          jumpToTypePage(type){
              //console.log("123124123");
              this.$router.push({
                  path:'/Home/MyCloudDisk/CateGory',
                  query:{
                      type:type
                  }
              })
          }
      },
      beforeMount() {
          window.onresize = function(){
              this.bodyHeight = document.documentElement.clientHeight - 66;
              if( null != document.getElementById('cStore_body')){
                  document.getElementById('cStore_body').style.height =this.bodyHeight + "px";
              }
          }
      },
      mounted() {
          document.getElementById('cStore_body').style.height = this.bodyHeight + "px";
      }
  }
</script>
<style scoped>
  .router-link-activer{
    text-decoration: none;
  }

  .demo-breadcrumb-separator{
    color: #ff5500;
    padding: 0 5px;
  }
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
  .el-aside{
    background: #EFF4F8;
  }

  .el-main{
    padding: 0;
  }

  .file-group li{
    height: 50px;
    line-height: 25px;
    overflow: hidden;
  }

  .file-group li p{
    margin-left: 32px;
  }
</style>
