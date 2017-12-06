import * as esriLoader from 'esri-loader'
import Provider, { isHoliday } from '@/store/models/provider'

export default {
  state: {
    provider: null
  },
  actions: {
    findHauler ({rootState, dispatch, commit}, folio) {
      return esriLoader.loadModules([
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query'
      ])
      .then(([QueryTask, Query]) => {
        var queryTask = new QueryTask({
          url: Provider.esriEndpointUrl()
        })

        var query = new Query()
        query.where = (folio) ? `${Provider.esriForeignKey()}=${folio}` : '1=0'

        query.returnGeometry = false
        query.outFields = Provider.esriFields()

        return queryTask.execute(query).then(response => {
          if (response.features.length) {
            commit('setProvider', new Provider(response.features[0].attributes))
          } else {
            throw new Error('There is currently no Hauler information associated with that address.')
          }
        })
      })
    }
  },
  mutations: {
    setProvider (state, data) {
      state.provider = data
    }
  },
  getters: {
    isHoliday: state => (moment, isRecycling = false) => {
      return isHoliday(moment, isRecycling)
    }
  }
}
