<template>
  <div id="app">

    <!-- <details><pre>{{ $store.state }}</pre></details> -->

    <address-form></address-form>

    <div is="HaulerResults"></div>

    <alert v-for="(alert, index) in $store.state.alerts.active" :error="alert" :key="index"></alert>

    <!-- <router-view></router-view> -->

  </div>
</template>

<script>
import Alert from '@/components/Alert'
import AddressForm from '@/components/AddressForm'
import HaulerResults from '@/components/results/Hauler'

export default {
  components: {
    Alert,
    AddressForm,
    HaulerResults
  }
}
</script>
