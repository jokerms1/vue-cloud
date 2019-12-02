<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
              <MenuItem name="1">
                <Icon type="ios-navigate"></Icon>
                  <router-link
                    class="router-link-active"
                    style="color: white"
                    to="/Home/MyCloudDisk">
                    我的网盘
                  </router-link>
              </MenuItem>
<!--              <MenuItem name="2">-->
<!--                <Icon type="ios-keypad"></Icon>-->
<!--                <router-link-->
<!--                  class="router-link-active"-->
<!--                  style="color: white"-->
<!--                  to="/Home/TransferList">-->
<!--                传输列表-->
<!--                </router-link>-->
<!--              </MenuItem>-->
              <MenuItem name="3">
                <Icon type="md-share"></Icon>
                <router-link
                  class="router-link-active"
                  style="color: white"
                  to="/Home/MyFriendShare">
                好友分享
                </router-link>
              </MenuItem>
              <MenuItem
                v-if="menuItemVisiable"
                name="4">
                <Icon type="md-options"></Icon>
                <router-link
                  class="router-link-active"
                  style="color: white"
                  to="/Home/ManageList">
                  后台管理
                </router-link>
              </MenuItem>
          </div>
        </Menu>
      </Header>
      <router-view></router-view>
    </Layout>
  </div>
</template>

<script>
    import router from "../../router";
  export default {
      name:"Home",
      data(){
          return{
              menuItemVisiable:false
          }
      },
      mounted(){
          if(this.$cookies.get('role') === 'admin' || this.$cookies.get('role') === 'root'){
              this.menuItemVisiable = true;
          }
      },
      router
  }
</script>
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .router-link-active{
    text-decoration: none;
  }
  .layout{
    border: 1px solid #d7dde4;
    /*background: #f5f7f9; d7dde4*/
    background: white;
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
    margin-left: 150px;
  }
</style>
