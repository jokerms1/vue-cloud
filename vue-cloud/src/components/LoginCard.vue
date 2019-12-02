<template>
  <div>
    <div class="card-body">
      <div class="panel-body form-inline" style="margin-top: 30px;">
        <label style="display: flex">
          <p>用户:</p>
          <input type="text" style="margin-left: 5px" class="form-control" placeholder="请输入用户名" v-model="loginUserName" @focus="delWrong">
        </label>
      </div>
      <div class="panel-body form-inline">
        <label style="display: flex">
          <p>密码:</p>
          <input type="password" style="margin-left: 5px" class="form-control" placeholder="请输入密码" v-model="loginPassword" @focus="delWrong">
        </label>
      </div>
    </div>
    <div class="card-footer" style="margin-left: 110px">
      <button  class="btn btn-primary" style="width: 200px;" @click="login">登陆</button>
    </div>
    <router-link style="position: absolute;margin-top: 40px;margin-left: 300px" :to="{'path':'/FindPassword'}">忘记密码?</router-link>
  </div>
</template>
<script>
  import {userRoutes,adminRoutes} from "../router";
  import {Message} from 'iview'
  export default {
    name:'LoginCard',
    data(){
        return{
            loginUserName:null,
            loginPassword:null
        }
    },
    methods:{
        //登陆函数
        login(){
            console.log("1112");
            console.log(this.loginUserName);
            if(null == this.loginUserName || "" == this.loginUserName){
                // alert('用户名不能为空')
                console.log("1113");
               Message.error('用户名不能为空');
                $(".panel-body input[type='text']").addClass("wrong");
            } else if(this.loginPassword === null || "" == this.loginPassword){
                // alert('密码不能为空')
                Message.error('密码不能为空');
                $(".panel-body input[type='password']").addClass("wrong");
            } else {
                //发送登陆请求
              this.axios.get('/login',{
                  params: {
                      id: this.loginUserName,
                      password: this.loginPassword
                  }
              }).then( (res)=>{
                  if("10000" == res.data.status){
                      //console.log("111");
                      //console.log(this.$router);
                      if(0==res.data.auth){
                          this.$cookies.set('role','user');
                          this.$router.addRoutes(userRoutes);
                      }else if(1 == res.data.auth){
                          this.$cookies.set('role','admin');
                          this.$router.addRoutes(userRoutes);
                          this.$router.addRoutes(adminRoutes);
                      }else if(2 == res.data.auth){
                          this.$cookies.set('role','root');
                          this.$router.addRoutes(userRoutes);
                          this.$router.addRoutes(adminRoutes);
                      }
                      if(null != res.data.token){
                          //this.$cookies.set('path','/');
                          this.$cookies.set('token',res.data.token);
                          //document.cookie = "token=" + res.data.token +"; path=/";
                      }else{
                          Message.error('token获取失败');
                          return;
                      }

                      this.$router.push("/Home");
                  }else{
                      console.log(res.data.status);
                      Message.error('登陆失败');
                  }
              }).catch((err)=> {
                  //alert(err.response.data.content)
                  Message.error('登陆失败');
              })
            }
        },
        delWrong(){
            $(".panel-body input").removeClass("wrong");
        }
    }
  }
</script>
<style scoped>

  p{
    width: 40px;
    text-align: right;
    margin-top: 7px;
  }
  .btn{
    position: relative;
    top:20px;
  }
  label{
    margin-left: 18px;
  }
  div{
    margin-left: 15px;
  }
  .wrong {
    border: 1px solid red;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
  }
</style>
