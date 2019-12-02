<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
    import router, {userRoutes,adminRoutes} from "./router";
export default {
    name: 'App',
    created() {
        console.log(this.$cookies.get('role'));
        if(this.$cookies.get('role') === 'user'){
            this.$router.options.routes.push(userRoutes)
            this.$router.addRoutes(userRoutes);
        }
        else if(this.$cookies.get('role') === 'admin' || this.$cookies.get('role') === 'root'){
            //this.$router.options.routes.push(adminRoutes)
            this.$router.addRoutes(userRoutes);
            this.$router.addRoutes(adminRoutes);
        }

    }
}
</script>

<style>
/*#app {*/
/*  font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
/*  -webkit-font-smoothing: antialiased;*/
/*  -moz-osx-font-smoothing: grayscale;*/
/*  text-align: center;*/
/*  color: #2c3e50;*/
/*  margin-top: 60px;*/
/*}*/
</style>
