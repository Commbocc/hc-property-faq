import * as esriLoader from 'esri-loader'
import Parcel from '@/store/models/parcel'

// vuex module
export default {
  state: {
    location: null,
    folio: null,
    parcel: null
  },
  actions: {
    findAddress ({commit}, input) {
      commit('clearAlerts')
      return esriLoader.loadModules([
        'esri/tasks/Locator'
      ])
      .then(([Locator]) => {
        var hcLocator = new Locator({
          // url: 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
          url: 'https://maps.hillsboroughcounty.org/arcgis/rest/services/Geocoding/DBO_composite_address_locator/GeocodeServer',
          outSpatialReference: {wkid: 102100}
        })

        return hcLocator.addressToLocations({
          address: {SingleLine: input},
          maxLocations: 1
        })
        .then(response => {
          if (response.length) {
            commit('setLocation', response[0].location)
          } else {
            throw new Error('That address was not found in our records.')
          }
        })
      })
      .catch(err => {
        commit('addAlert', err)
      })
    },
    fetchParcel ({state, commit}) {
      return esriLoader.loadModules([
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query'
      ])
      .then(([QueryTask, Query]) => {
        var queryTask = new QueryTask({
          url: Parcel.esriEndpointUrl()
        })

        var query = new Query()
        query.outFields = Parcel.esriFields()
        query.outSpatialReference = {wkid: Parcel.esriWkid()}
        query.returnGeometry = true
        query.geometry = state.location

        return queryTask.execute(query).then(response => {
          if (response.features.length) {
            commit('setParcel', new Parcel(response.features[0]))
          } else {
            throw new Error('A parcel could not be matched to that address.')
          }
        })
      })
      .catch(err => {
        commit('addAlert', err)
      })
    }
  },
  mutations: {
    setLocation (state, data) {
      state.location = data
    },
    setParcel (state, data) {
      state.parcel = data
    }
  }
}
