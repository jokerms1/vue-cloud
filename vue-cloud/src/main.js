// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
// import App from './App'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView)


import 'bootstrap/dist/css/bootstrap.css'
import WebSocket from 'websocket'

import App from "./App";
import axios from 'axios'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueAxios from 'vue-axios'
import router from './router/index.js'
import Vuex from 'vuex'
import store from "./vuex/store";
import VueCookies from 'vue-cookies'

Vue.use(VueAxios,axios)
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;
Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(Element)
Vue.use(WebSocket)
Vue.use(VueCookies)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:store,
  components:{App},
  template:'<App/>'
})
