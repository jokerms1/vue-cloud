import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Login from "../components/Login";
import Home from "../components/user/Home";
import LoginCard from "../components/LoginCard";
import RegisterCard from "../components/RegisterCard";
import FindPassword from "../components/FindPassword";
import MyCloudDisk from "../components/user/MyCloudDisk";
import TransferList from "../components/user/TransferList";
import MyFriendShare from "../components/user/MyFriendShare";
import AllFile from "../components/user/myclouddisk/aboutFile/AllFile";
import UploadingList from "../components/user/transferlist/UploadingList";
import Recycle from "../components/user/myclouddisk/aboutRecycle/Recycle";
import CateGory from "../components/user/myclouddisk/aboutCategory/CateGory";
import DownloadingList from "../components/user/transferlist/DownloadingList";
import AllContainer from "../components/user/myclouddisk/aboutContainer/AllContainer";
import FileTransferComplete from "../components/user/transferlist/FileTransferComplete";
import ManageList from "../components/admin/backstageManagement/managetList/ManageList";




let router = new Router({
  mode:'hash',
  routes: [
    {
      path: '/',
      redirect:'/Login'
    },
    {
      path: '/Login',
      component:Login,
      redirect:'/Login/LoginCard',
      children:[
        {path:'LoginCard',component:LoginCard},
        {path:'RegisterCard',component: RegisterCard}
      ]
      //redirect:'/Login/LoginCard'
    },
    {
      path: '/FindPassWord',
      component: FindPassword
    }
  ]
})
const userRoutes = [{
    path:'/Home',
    component:Home,
    redirect:'/Home/MyCloudDisk',
    children:[
      {
        path:'/Home/MyCloudDisk',
        component:MyCloudDisk,
        redirect:'/Home/MyCloudDisk/AllContainer',
        children:[
          {
            path:'/Home/MyCloudDisk/AllContainer',
            component:AllContainer
          },
          {
            path:'/Home/MyCloudDisk/AllFile',
            component:AllFile
          },
          {
            path:'/Home/MyCloudDisk/CateGory',
            component:CateGory
          },
          {
            path:'/Home/MyCloudDisk/Recycle',
            component:Recycle
          }
        ]
      },
      {
        path:'/Home/TransferList',
        component: TransferList,
        redirect:'/Home/TransferList/UploadingList',
        children:[
          {
            path:'/Home/TransferList/UploadingList',
            component:UploadingList
          },
          {
            path:'/Home/TransferList/DownloadingList',
            component: DownloadingList
          },
          {
            path:'/Home/TransferList/FileTransferComplete',
            component:FileTransferComplete
          }
        ]
      },
      {
        path:'/Home/MyFriendShare',
        component:MyFriendShare
      }
    ]
}]


const adminRoutes = [{
  path:'/Home',
  component:Home,
  children:[
    {
      path:'/Home/ManageList',
      component:ManageList
    }
  ]
}]



export default router
export {userRoutes,adminRoutes}
