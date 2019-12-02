<template>
   <div class="div1">
     <div class="div2">
       <div style="display: flex;margin: 0 auto;margin-left: 130px;margin-top: 50px;">
         <img id="img1" src="../images/1.png">
         <div class="dash" style="border-top:2px dashed #000000;height: 2px; width:200px;overflow:hidden;margin-top: 20px;"></div>
         <img src="../images/zhongzhimima.png">
         <div class="dash" style="border-top:2px dashed #000000;height: 2px; width:200px;overflow:hidden;margin-top: 20px;"></div>
         <img src="../images/zhongzhichenggong.png">
       </div>

       <div class="panel-body form-inline cc" style="margin-left: 240px;margin-top: 70px;">
         <label style="display: flex">
           <p style="margin-top: 10px;width: 40px">邮箱:</p>
           <input type="text" class="form-control" placeholder="请输入邮箱" v-model="email">
         </label>
       </div>
       <div class="panel-body form-inline cc" style="margin-left: 240px;margin-top: 65px;">
         <label style="display: flex">
           <p style="margin-top: 10px;width:40px">密码:</p>
           <input type="password"  class="form-control" placeholder="请输入密码" v-model="password">
         </label>
         <label style="display: flex">
           <p style="margin-top: 10px;width:40px;">确认:</p>
           <input type="password" class="form-control" placeholder="确认密码" v-model="confirmPassword">
         </label>
         <label style="display: flex">
           <input type="text" style="margin-left: 10px;width: 100px;margin-left: 40px;" class="form-control" placeholder="输入验证码" v-model="verficationCode">
           <button id="button_getVerfication" class="btn btn-primary" style="margin-left: 5px;" @click="getVerficationCode">获取验证码</button>
         </label>
       </div>
       <div class="panel-body form-inline cc" style="position: absolute;left:38%;top:40%">
         <h1 style="color: blue">修改成功！</h1>
       </div>
       <div class="card-footer" style="margin-top: 40px;margin-top:26%; margin-left:34%">
         <button id="next" class="btn btn-primary" style="width: 200px;position: absolute;left:37%;top:78%" @click="next" >下一步</button>
       </div>
     </div>
   </div>
</template>
<script>
    export default{
        name:'FindPassword',
        data(){
            return{
                count:0,
                time:null,
                email:null,
                result:true, /*true修改密码成功*/
                password:null,
                confirmPassword:null,
                verficationCode:null
            }
        },
        created(){
          $(function () {
              //隐藏下两步操作的div
              $('.cc').eq(1).hide()
              $('.cc').eq(2).hide()
          })
        },
        methods:{
            back(){
                /*返回主页面*/
                this.$router.push('./');
            },
            next(){
                /*下一步按钮操作函数*/
                if(this.count == 2){
                    //无论成功还是失败，都返回到主页面
                    this.back()
                    return ;
                }

                if(this.count == 0)
                {
                    //用于写第一步里调用函数
                    //判断邮箱是否为空
                    //设置下一步按钮为不可点击
                    $('#next').attr('disabled',true);
                    if(null == this.email){
                        alert('邮箱不能为空,请输入邮箱再进入下一步');
                        //设置下一步按钮为可点击
                        $("#next").attr('disabled',false);
                        return;
                    }else{
                        $("#next").attr('disabled',false);
                        this.changeDiv();
                    }
                }else if(this.count == 1) {
                    //用于第二步里调用函数
                    //判断修改密码是否成功
                    //发送修改密码请求
                    //判断验证码不能为空
                    $('#next').attr('disabled',true);
                    if( null == this.verficationCode){
                        alert('验证码不能为空');
                        $('#next').attr('disabled',false);
                        return;
                    }else{
                        this.sendModifyPassword()
                    }
                }
            },
            //获取验证码函数
            getVerficationCode(){
                $("#button_getVerfication").attr('disabled',true)
                $('#button_getVerfication').addClass("width_1");
                this.time = 60
                $('#button_getVerfication').text('重新发送'+this.time);
                if( null != this.intervalId){
                    clearInterval(this.intervalId)
                    $('#button_getVerfication').text('获取验证码');
                    this.time = null
                    this.intervalId = null
                    return;
                }
                //60s定时器
                this.intervalId = setInterval(()=> {
                    this.time -= 1
                    $('#button_getVerfication').text('重新发送'+this.time);
                    if(this.time === 0) {
                        $('#button_getVerfication').text('获取验证码');
                        $("#button_getVerfication").attr('disabled',false)
                        $("#button_getVerfication").removeClass("width_1")
                        clearInterval(this.intervalId)
                        this.intervalId = null
                        this.time = null
                    }
                },1000);

                console.log(this.email);
                //发送验证码请求
                this.axios.get('/sendcaptcha',{
                    params: {
                        email: this.email
                    }
                }).then((res)=>{
                    console.log(res);
                    // console.log(res.status);
                    if( "10000" == res.data.status){
                        //获取验证码成功调用函数
                        this.$Message.success("获取验证码成功");
                    }else if("10005" == res.data.status){
                        $this.$Message.error('验证码已存在');
                    }else if("10006" == res.data.status){
                        $this.$Message.error('验证码错误');
                    }else if("10007" == res.data.status){
                        $this.$Message.error("验证码超时");
                    }
                }).catch((err)=>{
                    console.log(err);
                })
            },
            //修改密码请求
            sendModifyPassword(){
                this.axios.get('/resetpwd',{
                    params:{
                        email:this.email,
                        captcha:this.verficationCode,
                        password: this.password,
                        repassword: this.confirmPassword
                    }
                }).then((res)=>{
                    console.log(res.data.status);
                    if(10000 == res.data.status){
                        this.result = true;
                        $('#next').eq(0).text('返回主页面');
                        this.changeDiv()
                    }else{
                        this.result = false;
                        $('h1').eq(0).text('修改失败！');
                        $('#next').eq(0).text('返回主页面');
                        this.changeDiv()
                    }
                    $('#next').attr('disabled',false);
                }).catch((err)=>{
                    console.log(err);
                    $('#next').attr('disabled',true);
                    $('h1').eq(0).text('修改失败！');
                    $('next').eq(0).text('返回主页面');
                    this.changeDiv()
                })
            },
          changeDiv(){
              this.count += 1;
              $('.cc').eq(this.count-1).hide();
              $('.cc').eq(this.count).show();
              var picPath = (this.count+1).toString() + ".png";
              $('img').eq(this.count).attr("src",require(`../images/${picPath}`));
              //更改虚线的颜色
              $('.dash').eq(this.count-1).css("border-top","2px dashed #45ef22")
          }

        }
    }
</script>
<style scoped>
  .width_1{
    width: 100px;
  }

  label{
    margin-left: 0px;
  }
  .btn{
    position: relative;
    left:0px;
    top:0px;
  }
  .div2{
    position: absolute;
    margin: 0 auto;
    left:0;
    right: 0;
    bottom: 0;
    top:20%;
    height: 400px;
    width: 800px;
    border-radius: 8px 8px 8px 8px;
    background:rgba(255,255,255,0.2);
  }
 .div1{
   top:0;
   left:0;
   width: 100%;
   height: 100%;
   position: fixed;
   background: linear-gradient(to right, dodgerblue , lightskyblue);
 }
  .cc{

  }
  .dash{

  }
</style>
