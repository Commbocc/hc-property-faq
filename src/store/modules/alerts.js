export default {
  state: {
    active: []
  },
  mutations: {
    addAlert (state, data) {
      state.active.push(data)
    },
    clearAlerts (state) {
      state.active = []
    }
  }
}
