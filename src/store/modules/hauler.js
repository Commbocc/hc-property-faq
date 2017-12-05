import * as esriLoader from 'esri-loader'
import Provider from '@/store/models/provider'

export default {
  state: {
    provider: null
  },
  actions: {
    findHauler ({rootState, dispatch, commit}, address) {
      commit('setProvider', null)
      return dispatch('findAddress', address).then(() => {
        return dispatch('fetchParcel').then(() => {
          return esriLoader.loadModules([
            'esri/tasks/QueryTask',
            'esri/tasks/support/Query'
          ])
          .then(([QueryTask, Query]) => {
            var queryTask = new QueryTask({
              url: Provider.esriEndpointUrl()
            })

            var query = new Query()
            query.where = (rootState.address.parcel.folio) ? `${Provider.esriForeignKey()}=${rootState.address.parcel.folio}` : null

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
          .catch(err => {
            commit('addAlert', err)
          })
        })
      })
    }
  },
  mutations: {
    setProvider (state, data) {
      state.provider = data
    }
  }
}
