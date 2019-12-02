<template>
  <el-table
    :data="tableData"
  >
    <el-table-column
      fixed
      prop="uid"
      label="用户账号"
      align="center"
      min-width="150">
    </el-table-column>
    <el-table-column
      fixed
      prop="id"
      label="用户名"
      align="center"
      min-width="150">
    </el-table-column>
    <el-table-column
      fixed
      prop="container"
      label="容器"
      align="center"
      min-width="150">
    </el-table-column>
    <el-table-column
      fixed
      prop="max"
      label="最大容量"
      align="center"
      min-width="150">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      align="center"
      min-width="100">
      <template slot-scope="scope">
        <el-button @click="dealContainerCreateRequest(scope.row,true)" type="text">允许</el-button>
        <el-button @click="dealContainerCreateRequest(scope.row,false)" type="text">拒绝</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
    export default {
        name:'ManageList',
        data(){
            return{
                tableData:[]
            }
        },
        methods:{
            /**
             * 处理容器创建的请求 op:true允许创建，false拒绝创建
             * @param e
             * @param op
             */
            dealContainerCreateRequest(e,op){
                this.axios.get('dealccr',{
                    params:{
                        uid:e.uid,
                        container:e.container,
                        max:e.max,
                        id:e.id,
                        op:op
                    }
                }).then((res)=>{
                    console.log(res.data);
                    if("10000" === res.data.status){
                        this.tableData.forEach((item,index,arr)=>{
                            if(item.container === e.container && item.uid === e.uid){
                                this.tableData.splice(index,1);
                                return;
                            }
                        })
                    }
                }).catch((err)=>{
                    console.log(err);
                })
            },
            /**
             * 初始化文件表格
             */
            initTableData(){
                this.axios.get('getccr',{
                    params:{
                        begin:0,
                        size:10
                    }
                }).then((res)=>{
                    if(res.data != null ){
                        this.tableData = res.data;
                    }

                }).catch((err)=>{
                    console.log(err);
                })
            },

        },
        mounted() {
            this.initTableData();
        }
    }
</script>
<style scoped>

</style>
