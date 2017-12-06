<template>
  <div id="HcHaulerApp">

    <!-- <details><pre>{{ $store.state }}</pre></details> -->

    <address-form v-on:search="search"></address-form>

    <div is="HaulerResults"></div>

    <alert v-for="(alert, index) in $store.state.alerts.active" :error="alert" :key="index"></alert>

    <!-- <router-view></router-view> -->

  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import Alert from '@/components/Alert'
import AddressForm from '@/components/AddressForm'
import HaulerResults from '@/components/results/Hauler'

export default {
  components: {
    Alert,
    AddressForm,
    HaulerResults
  },
  methods: {
    search (searchInput) {
      this.clearAlerts()
      this.setFormIsSearching(true)
      this.setProvider(null)
      this.findAddressAndParcel(searchInput).then(() => {
        return this.findHauler(this.folio).then(() => {
          this.setFormIsSearching(false)
        })
      }).catch(err => {
        this.setFormIsSearching(false)
        this.addAlert(err)
      })
    },
    ...mapActions([
      'findAddressAndParcel',
      'findHauler'
    ]),
    ...mapMutations([
      'clearAlerts',
      'addAlert',
      'setFormIsSearching',
      'setProvider'
    ])
  },
  computed: {
    ...mapState({
      folio: state => state.address.parcel.folio
    })
  }
}
</script>
