<template>
  <div>
    <div class="card-body">
      <div class="div3 form-inline">
        <label style="display: flex">
          <p>用户:</p>
          <input type="text"  style="margin-left: 10px" class="form-control" placeholder="请输入用户名" v-model="registerId"  @focus="delWrong">
        </label>
      </div>
      <div class="form-inline div3">
        <label style="display: flex">
          <p>邮箱:</p>
          <input type="text"  style="margin-left: 10px" class="form-control" placeholder="请输入邮箱" v-model="registerEmail" @focus="delWrong">
        </label>
      </div>
      <div class="form-inline div3">
        <label style="display: flex">
          <p>密码:</p>
          <input type="password"  style="margin-left: 10px" class="form-control" placeholder="请输入密码" v-model="registerPassword" @focus="delWrong">
        </label>
      </div>
      <div class="form-inline" >
        <label style="display: flex">
          <p>确认密码:</p>
          <input type="password" style="margin-left: 10px" class="form-control" placeholder="确认密码" v-model="confirmPassword" @focus="delWrong">
        </label>
      </div>
      <div class="form-inline">
        <label style=" margin-top: 5px;display: inline-block">

          <input type="text"  class="form-control" style="margin-left:90px;width: 120px;" placeholder="输入验证码" v-model="v" @focus="delWrong">
          <button id="button_getVerfication" class="btn2 btn-primary" @click="getVerficationCode" v-model="time">获取验证码</button>
        </label>
      </div>
    </div>
    <div class="card-footer">
      <button class="btn3 btn-primary" @click="register">注册</button>
    </div>
  </div>
</template>
<script>
    import { Message } from 'iview'
 export default {
     name:'RegisterCard',
     data(){
         return{
             time:null, /*定时变量*/
             intervalId:null, /*定时函数*/
             registerId:null,
             registerEmail:null,
             confirmPassword:null,
             v:null,

             registerPassword:null,

         }
     },
     methods:{
         //获取验证码
         getVerficationCode(){
             if( null == this.registerEmail || this.registerEmail == "") {
                 // alert("注册的邮箱不能为空");
                 Message.error('注册的邮箱不能为空');
                 $(".card-body [class='form-control']").eq(1).addClass("wrong");
             }else{
                 $("#button_getVerfication").attr('disabled',true)
                 $('#button_getVerfication').addClass("width_1");
                 this.time = 60
                 $('#button_getVerfication').text('重新发送'+this.time)
                 if( null != this.intervalId){
                     clearInterval(this.intervalId)
                     this.time = null
                     this.intervalId = null
                     return;
                 }
                 //60s定时器
                 this.intervalId = setInterval(()=> {
                     this.time -= 1
                     $('#button_getVerfication').text('重新发送'+this.time)
                     if(this.time === 0) {
                         $('#button_getVerfication').text('获取验证码');
                         $("#button_getVerfication").attr('disabled',false)
                         $("#button_getVerfication").removeClass("width_1")
                         clearInterval(this.intervalId)
                         this.intervalId = null
                         this.time = null
                     }
                 },1000);

                 this.axios.get('/sendcaptcha',{
                     params: {
                         email: this.registerEmail
                     }
                 }).then((res)=>{
                     console.log(res);
                     // console.log(res.status);
                     if( "10000" == res.data.status){
                         //获取验证码成功调用函数
                         // $("#button_getVerfication").text('获取验证码');
                         // $("#button_getVerfication").attr('disabled',false)
                         // $("#button_getVerfication").removeClass("width_1")
                         this.$Message.success("获取验证码成功");
                     }else if("10005" == res.data.status){
                         this.$Message.warning("验证码已存在");
                     }
                 }).catch((err)=>{
                      console.log(err);
                 })

             }
         },
         //注册函数
         register(){
             if( null == this.registerId || "" == this.registerId){
                 // alert('用户Id不能为空');
                 Message.error('用户Id不能为空');
                 $(".card-body [class='form-control']").eq(0).addClass("wrong");
             }else if( null == this.registerEmail || "" == this.registerEmail){
                 Message.error('邮箱不能为空');
                 $(".card-body [class='form-control']").eq(1).addClass("wrong");
             }else if(null === this.registerPassword || "" == this.registerPassword){
                 // alert('密码不能为空');
                 Message.error('密码不能为空');
                 $(".card-body [class='form-control']").eq(2).addClass("wrong");
             }else if(null === this.confirmPassword || "" === this.confirmPassword){
                 // alert("确认密码不能为空");
                 Message.error('确认密码不能为空');
                 $(".card-body [class='form-control']").eq(3).addClass("wrong");
             }else if(null === this.v){
                 Message.error('验证码不能为空');
             }
             else{

                 this.axios.get('/register',{
                     params:{
                         id:this.registerId,
                         password:this.registerPassword,
                         repassword:this.confirmPassword,
                         email: this.registerEmail,
                         captcha:this.v
                     }
                 }).then( (res)=>{
                     console.log("1112:"+res.data.status);
                     if("10000" == res.data.status){
                         this.$Message.success('注册成功')
                         this.registerId = null
                         this.registerEmail = null
                         this.registerPassword = null
                         this.confirmPassword = null
                         this.v = null
                     }else if(10003 == res.data.status){
                         this.$Message.warning('邮箱已注册，不能再次注册');
                     }else if(10006 == res.data.status){
                         this.$Message.error('验证码输入错误');
                     } else if(10007 == res.data.status){
                         this.$Message.error('验证码超时');
                     }else if(10013 == res.data.status){
                         this.$Message.error('token解析失败')
                     }
                 }).catch((err)=> {
                     //alert(err.response.data.content)
                     Message.error('登陆失败');
                 })
             }
         },
         //删除警告
         delWrong(){
             $(".card-body input").removeClass("wrong");
         }
     }
 }
</script>
<style scoped>
 /*.panel-body{*/
 /*  margin-top: 5px;*/
 /*}*/
 .width_1{
   width: 100px;
 }
 p{
   width: 80px;
   margin-top: 7px;
   text-align:right;
 }
 label{
   margin-left: 30px;
 }
 .btn{
   position: relative;
   left:60px;
   top:20px;
 }
 .btn3{
   width: 200px;
   margin-top: 5px;
   margin-left: 120px;
   display: inline-block;
   font-weight: normal;
   line-height: 1.8;
   text-align: center;
   white-space: nowrap;
   vertical-align: middle;
   -webkit-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
   border: 1px solid transparent;
   padding: 0.5rem 1rem;
   font-size: 1rem;
   border-radius: 0.25rem;
   -webkit-transition: all 0.2s ease-in-out;
   -o-transition: all 0.2s ease-in-out;
   transition: all 0.2s ease-in-out;
 }
 .btn2{
   display: inline-block;
   font-weight: normal;
   line-height: 1.8;
   text-align: center;
   white-space: nowrap;
   vertical-align: middle;
   -webkit-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
   border: 1px solid transparent;
   padding: 0.5rem 1rem;
   font-size: 1rem;
   border-radius: 0.25rem;
   -webkit-transition: all 0.2s ease-in-out;
   -o-transition: all 0.2s ease-in-out;
   transition: all 0.2s ease-in-out;
 }
  .div3{
    margin-top: 10px;
  }
 .wrong {
   border: 1px solid red;
   border-radius: 4px;
   box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
 }
</style>
