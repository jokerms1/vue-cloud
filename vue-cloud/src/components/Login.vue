<template>
  <div style="display: flex">
    <img class="bgone" src="../images/1.jpg">
    <img class="pic" src="../images/a.png">
    <div class="table">
      <div class="wel">云存储平台</div>
      <div class="wel1">MOU MOU XI TONG HUO TAI DENG LU</div>
      <div class="card1">
        <div style="margin:auto;width: 300px;overflow: hidden">
          <ul class="nav nav-tabs nav-justified">
            <li>
              <router-link to="/Login/LoginCard">
                登陆
              </router-link>
            </li>
            <li>
              <router-link to="/Login/RegisterCard">
                注册
              </router-link>
            </li>
          </ul>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  // import router1 from "./router";
  import router from "../router";
  export default{
      name:'Login',
      router:router
  }
</script>

<style scoped>
  ul{
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .card1{
    position: absolute;
    left:500px;
    top:50px;
    border-radius: 15px 15px 15px 15px;
    background: white;
    shadow:15px;
    height: 350px;
    width: 420px;
    box-shadow: 5px 5px 5px 5px #888888;
  }
  .wel{
    width: 960px;
    height: 35px;
    color: #fff;
    font-size: 30px;
    position: absolute;
    top: -7rem;
    text-align: center;


  }.wel1{
     width: 960px;
     height: 35px;
     color: #fff;
     font-size: 12.38px;
     position: absolute;
     top: -4rem;
     text-align: center;

   }
  .table{
    background-color: #FFFFFF;
    width: 960px;
    height: 465px;
    position: absolute;
    top:20%;right: 0;left: 0;bottom: 0;margin: auto;
  }
  .bgone{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;right: 0;left: 0;bottom: 0;margin: auto;
  }
  .pic{
    width: 492px;
    height: auto;
    position: absolute;
    top:173px;right: 453px;left: 0;bottom: 0;margin: auto;
    z-index: 99999;
  }
  .user2{
    border-radius: 25px;
    position: absolute;
    top: 7.8rem;
    right:4rem;
    height: 300px;
    width: 300px;
    display: flex;
  }
</style>
