import Vue from 'vue'
import Vuex from 'vuex'

import alerts from './modules/alerts'
import address from './modules/address'
// import questions from './questions'
import hauler from './modules/hauler'
// import evacuation from './evacuation'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    alerts,
    address,
    hauler
  }
})
