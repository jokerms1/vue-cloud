<template>
  <Layout id="cStore_body">
    <Sider hide-trigger :style="{background: '#ffffff'}" >
      <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
        <div class="file-group">
          <router-link to="/Home/TransferList/UploadingList" class="router-link-activer">
            <MenuItem name="1">
              <Icon type="ios-cloud-upload-outline"></Icon>
              <span>正在上传</span>
            </MenuItem>
          </router-link>
          <router-link to="/Home/TransferList/DownloadingList" class="router-link-activer">
            <MenuItem name="2">
              <Icon type="ios-cloud-download-outline"></Icon>
              <span>正在下载</span>
            </MenuItem>
          </router-link>
          <router-link to="/Home/TransferList/FileTransferComplete" class="router-link-activer">
            <MenuItem name="3">
              <Icon type="ios-checkmark-circle-outline"></Icon>
              <span>传输完成</span>
            </MenuItem>
          </router-link>
        </div>
      </Menu>
      <div style="width: 100%;height: 100%;border-right: 1px solid rgba(149,149,149,0.23);">

      </div>
    </Sider>
    <!--    <Layout :style="{padding: '0 24px 24px'}">-->
    <Layout>

      <!--      <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">-->
      <Content :style="{background:'#fff',minWidth:'1000px'}">
          <router-view></router-view>
      </Content>

    </Layout>
  </Layout>
</template>
<script>
  export default {
      name:'TransferList',
      data(){
          return{
              successFileNumber:0,
              bodyHeight: document.documentElement.clientHeight-66,
              list:null,
              // list:[
              //     {id:1,name:'奔驰',ctime:new Date()},
              //     {id:2,name:'宝马',ctime:new Date()}
              //     ],
          }
      },
      methods:{

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
  li{
    list-style: none;
  }
  .transfer-table{
    position: relative;
  }


  .bg{
    background: rgba(76, 139, 150, 0.08);
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
