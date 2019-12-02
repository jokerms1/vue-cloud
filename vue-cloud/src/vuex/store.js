import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

var store = new Vuex.Store({
  state:{
    peopleInfo:{
      token:''
    },
    uploadlist:new Array(),
    downloadlist:new Array()
  },
  mutations:{
    increment(state){

    }
  },
  getters:{

  }
});

export default store
